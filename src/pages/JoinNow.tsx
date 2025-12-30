import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import {
    Loader2,
    Upload,
    CheckCircle2,
    Globe,
    GraduationCap,
    Lightbulb,
    Trophy,
    ScrollText,
    Users,
    Heart,
    CreditCard
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

const formSchema = z.object({
    email: z.string().email('Invalid email address'),
    full_name: z.string().min(2, 'Full name is required'),
    prn: z.string().min(1, 'PRN is required'),
    division: z.string().min(1, 'Division is required'),
    roll_number: z.string().min(1, 'Roll number is required'),
    date_of_birth: z.string().min(1, 'Date of birth is required'),
    date: z.string().min(1, 'Date is required'),
    address: z.string().min(5, 'Address is required'),
    contact_number: z.string().min(10, 'Valid contact number is required'),
    payment_confirmed: z.boolean().refine(val => val === true, 'You must confirm payment'),
    screenshot: z.any().optional(), // Handled separately
})

interface PaymentSettings {
    bank_name: string;
    account_holder_name: string;
    account_number: string;
    ifsc_code: string;
    account_type: string;
    upi_id: string;
    fee_amount: number;
    qr_code_url: string;
}

export default function JoinNow() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [ticketFile, setTicketFile] = useState<File | null>(null)
    const [paymentSettings, setPaymentSettings] = useState<PaymentSettings | null>(null)
    const [currentStep, setCurrentStep] = useState(1);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            payment_confirmed: false,
        }
    })

    // Watch fields for dynamic QR generation
    const fullName = form.watch('full_name');

    useEffect(() => {
        loadPaymentSettings()
    }, [])

    const loadPaymentSettings = async () => {
        // Fetch settings from DB
        const { data } = await supabase
            .from('payment_settings')
            .select('*')
            .single()

        if (data) {
            setPaymentSettings(data)
        } else {
            // Unlikely to happen if migration ran, but fallback just in case
            setPaymentSettings({
                bank_name: 'Canara Bank',
                account_holder_name: 'SAKEC ACM STUDENT CHAPTER',
                account_number: '8678101302064',
                ifsc_code: 'CNRB0000105',
                account_type: 'Savings',
                upi_id: '',
                fee_amount: 400,
                qr_code_url: ''
            })
        }
    }

    const handleNextStep = async () => {
        // Validate Step 1 fields
        const step1Fields = ['email', 'full_name', 'prn', 'division', 'roll_number', 'date_of_birth', 'date', 'address', 'contact_number'] as const;
        const isValid = await form.trigger(step1Fields);
        if (isValid) {
            setCurrentStep(2);
        }
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!ticketFile) {
            toast.error('Please upload the payment screenshot')
            return
        }

        setIsSubmitting(true)
        try {
            // 1. Upload screenshot
            const fileExt = ticketFile.name.split('.').pop()
            const fileName = `${values.prn}_${Date.now()}.${fileExt}`
            const { error: uploadError } = await supabase.storage
                .from('membership_payment_screenshots')
                .upload(fileName, ticketFile)

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from('membership_payment_screenshots')
                .getPublicUrl(fileName)

            // 2. Insert record
            const { date, payment_confirmed, date_of_birth, ...rest } = values
            const { error: insertError } = await supabase
                .from('membership_applications')
                .insert({
                    ...rest,
                    dob: date_of_birth,
                    payment_screenshot_url: publicUrl,
                    status: 'pending' // Default status
                })

            if (insertError) throw insertError

            // 3. Send confirmation email (non-blocking)
            fetch('/api/send-membership-confirmation.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: values.full_name,
                    email: values.email
                }),
            }).catch(err => console.error('Email send error:', err));

            toast.success('Application submitted successfully! Check your email for confirmation.')
            form.reset()
            setTicketFile(null)
            setCurrentStep(1) // Reset to step 1

        } catch (error: any) {
            console.error('Submission error:', error)
            toast.error(error.message || 'Failed to submit application. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    // Helper to generate UPI String
    const getUPIString = () => {
        if (!paymentSettings?.upi_id) return '';
        const pa = paymentSettings.upi_id;
        const pn = fullName || 'Student'; // Payee Name
        const am = paymentSettings.fee_amount || 400; // Amount
        const tn = 'Membership Fee'; // Transaction Note
        const cu = 'INR'; // Currency

        return `upi://pay?pa=${pa}&pn=${encodeURIComponent(pn)}&am=${am}&cu=${cu}&tn=${encodeURIComponent(tn)}`;
    };

    const benefits = [
        { icon: Globe, text: "ACM Digital Library resources" },
        { icon: GraduationCap, text: "Networking opportunities with industry experts and researchers" },
        { icon: Lightbulb, text: "Workshops, hackathons, and coding competitions" },
        { icon: Trophy, text: "Exclusive career guidance and mentorship opportunities" },
        { icon: ScrollText, text: "Official membership certificate" },
        { icon: Users, text: "A chance to be part of a global computing community" },
        { icon: Heart, text: "Team celebrations & trekking" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header & Info (Common) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-4"
                >
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                        SAKEC ACM Student Chapter Membership – 2025
                    </h1>
                    <p className="text-xl text-gray-600">
                        Welcome to SAKEC ACM Student Chapter Membership – 2025 🎉
                    </p>
                </motion.div>

                {/* Info Card - Only show on Step 1 */}
                {currentStep === 1 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-2xl shadow-xl overflow-hidden"
                    >
                        {/* ... content ... */}
                        <div className="p-8 space-y-6">
                            <p className="text-gray-700 leading-relaxed">
                                The Association for Computing Machinery (ACM) is the world's largest educational and scientific computing society, bringing together computing educators, researchers, and professionals to inspire dialogue, share resources, and tackle challenges in the field of computing.
                            </p>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900">By joining the SAKEC ACM Student Chapter, you will gain access to:</h3>
                                <div className="grid gap-4 md:grid-cols-2">
                                    {benefits.map((benefit, i) => (
                                        <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                            <benefit.icon className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                            <span className="text-sm text-gray-700">{benefit.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-6 md:p-8">
                    {/* Step Indicator */}
                    <div className="flex items-center justify-center mb-8">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>1</div>
                        <div className={`w-20 h-1 bg-gray-200 mx-2 ${currentStep >= 2 ? 'bg-blue-600' : ''}`}></div>
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>2</div>
                    </div>

                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                        {/* STEP 1: Personal Details */}
                        {currentStep === 1 && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-6"
                            >
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Personal Details</h2>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="flex gap-1">Email <span className="text-red-500">*</span></Label>
                                        <Input {...form.register('email')} id="email" type="email" placeholder="email@example.com" />
                                        {form.formState.errors.email && <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="full_name" className="flex gap-1">Full Name <span className="text-red-500">*</span></Label>
                                        <Input {...form.register('full_name')} id="full_name" placeholder="John Doe" />
                                        {form.formState.errors.full_name && <p className="text-sm text-red-500">{form.formState.errors.full_name.message}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="prn" className="flex gap-1">PRN <span className="text-red-500">*</span></Label>
                                        <Input {...form.register('prn')} id="prn" placeholder="PRN Number" />
                                        {form.formState.errors.prn && <p className="text-sm text-red-500">{form.formState.errors.prn.message}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="division" className="flex gap-1">Division <span className="text-red-500">*</span></Label>
                                        <Input {...form.register('division')} id="division" placeholder="e.g. A" />
                                        {form.formState.errors.division && <p className="text-sm text-red-500">{form.formState.errors.division.message}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="roll_number" className="flex gap-1">Roll Number <span className="text-red-500">*</span></Label>
                                        <Input {...form.register('roll_number')} id="roll_number" placeholder="e.g. 15" />
                                        {form.formState.errors.roll_number && <p className="text-sm text-red-500">{form.formState.errors.roll_number.message}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="date_of_birth" className="flex gap-1">Date of Birth <span className="text-red-500">*</span></Label>
                                        <Input {...form.register('date_of_birth')} id="date_of_birth" type="date" />
                                        {form.formState.errors.date_of_birth && <p className="text-sm text-red-500">{form.formState.errors.date_of_birth.message}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="date" className="flex gap-1">Date <span className="text-red-500">*</span></Label>
                                        <Input {...form.register('date')} id="date" type="date" />
                                        <p className="text-xs text-gray-500">Date of application</p>
                                        {form.formState.errors.date && <p className="text-sm text-red-500">{form.formState.errors.date.message}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="contact_number" className="flex gap-1">Contact Number <span className="text-red-500">*</span></Label>
                                        <Input {...form.register('contact_number')} id="contact_number" placeholder="Mobile Number" />
                                        {form.formState.errors.contact_number && <p className="text-sm text-red-500">{form.formState.errors.contact_number.message}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="address" className="flex gap-1">Address <span className="text-red-500">*</span></Label>
                                    <Textarea {...form.register('address')} id="address" placeholder="Your full address" />
                                    {form.formState.errors.address && <p className="text-sm text-red-500">{form.formState.errors.address.message}</p>}
                                </div>

                                <Button type="button" onClick={handleNextStep} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                    Next: Payment Details
                                </Button>
                            </motion.div>
                        )}


                        {/* STEP 2: Payment Details */}
                        {currentStep === 2 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <CreditCard className="w-6 h-6 text-blue-600" /> Payment
                                </h2>

                                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 space-y-6">
                                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-blue-100 shadow-sm">
                                        <span className="font-medium text-gray-900">Total Amount</span>
                                        <span className="text-3xl font-bold text-blue-700">₹{paymentSettings?.fee_amount || 400}</span>
                                    </div>

                                    {/* DYNAMIC QR CODE SECTION */}
                                    <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
                                        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 flex flex-col items-center">
                                            {paymentSettings?.upi_id ? (
                                                <QRCodeSVG
                                                    value={getUPIString()}
                                                    size={200}
                                                    level={"H"}
                                                    includeMargin={true}
                                                />
                                            ) : paymentSettings?.qr_code_url ? (
                                                <img
                                                    src={paymentSettings.qr_code_url}
                                                    alt="Payment QR"
                                                    className="w-48 h-48 object-contain"
                                                />
                                            ) : (
                                                <div className="w-48 h-48 flex items-center justify-center bg-gray-100 text-gray-400">No QR Code</div>
                                            )}
                                            <p className="mt-3 text-sm font-semibold text-gray-900">Scan to Pay</p>
                                            <p className="text-xs text-gray-500">UPI: {paymentSettings?.upi_id}</p>
                                        </div>

                                        <div className="flex-1 space-y-3 text-sm w-full">
                                            <h4 className="font-semibold text-gray-900 border-b pb-2">Bank Transfer Details</h4>
                                            <div className="grid grid-cols-2 gap-2">
                                                <span className="text-gray-500">Bank:</span>
                                                <span className="font-medium text-gray-900">{paymentSettings?.bank_name}</span>

                                                <span className="text-gray-500">Account No:</span>
                                                <span className="font-medium text-gray-900">{paymentSettings?.account_number}</span>

                                                <span className="text-gray-500">IFSC:</span>
                                                <span className="font-medium text-gray-900">{paymentSettings?.ifsc_code}</span>

                                                <span className="text-gray-500">Holder:</span>
                                                <span className="font-medium text-gray-900">{paymentSettings?.account_holder_name}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* UPLOAD SECTION */}
                                <div className="space-y-4 pt-4 border-t border-gray-100">
                                    <Label className="flex gap-1 text-lg">Upload Payment Screenshot <span className="text-red-500">*</span></Label>
                                    <div className="mt-2 flex justify-center rounded-xl border-2 border-dashed border-gray-300 px-6 py-10 hover:bg-gray-50 transition-colors bg-white">
                                        <div className="text-center">
                                            {ticketFile ? (
                                                <div className="flex flex-col items-center">
                                                    <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" aria-hidden="true" />
                                                    <p className="mt-2 text-sm font-semibold text-green-600 truncate max-w-xs">{ticketFile.name}</p>
                                                    <Button variant="ghost" size="sm" onClick={() => setTicketFile(null)} className="mt-2 text-red-500 hover:text-red-700">Remove</Button>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center cursor-pointer">
                                                    <Upload className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
                                                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                                        <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-semibold text-blue-600 focus-within:outline-none hover:text-blue-500">
                                                            <span>Upload a file</span>
                                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={(e) => {
                                                                if (e.target.files && e.target.files[0]) setTicketFile(e.target.files[0])
                                                            }} />
                                                        </label>
                                                        <p className="pl-1">or drag and drop</p>
                                                    </div>
                                                    <p className="text-xs leading-5 text-gray-500">PNG, JPG up to 10MB</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3 pt-2">
                                    <Checkbox
                                        id="confirm"
                                        checked={form.watch('payment_confirmed')}
                                        onCheckedChange={(checked) => form.setValue('payment_confirmed', checked as boolean)}
                                        className="mt-1"
                                    />
                                    <label htmlFor="confirm" className="text-sm font-medium leading-tight text-gray-700">
                                        I confirm that the details provided are accurate and the payment of <span className="font-bold text-gray-900">₹{paymentSettings?.fee_amount}</span> has been completed. <span className="text-red-500">*</span>
                                    </label>
                                </div>
                                {form.formState.errors.payment_confirmed && (
                                    <p className="text-sm text-red-500">{form.formState.errors.payment_confirmed.message}</p>
                                )}

                                <div className="flex gap-4 pt-4">
                                    <Button type="button" variant="outline" onClick={() => setCurrentStep(1)} className="flex-1">
                                        Back
                                    </Button>
                                    <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white" disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                                            </>
                                        ) : 'Submit Application'}
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    )
}
