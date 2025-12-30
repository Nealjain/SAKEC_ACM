import AnimatedFooter from "./ui/animated-footer"

export default function Footer() {
  return (
    <AnimatedFooter
      leftLinks={[
        { href: "/about", label: "About Us" },
        { href: "/team", label: "Our Team" },
        { href: "/events", label: "Events" },
        { href: "/gallery", label: "Gallery" },
        { href: "/nfc/283006fb-63d7-40bf-bf62-e3751c767499", label: "NFC Profile" },
      ]}
      rightLinks={[
        { href: "/blog", label: "Blog" },
        { href: "/contact", label: "Contact" },
        { href: "https://www.instagram.com/acm_sakec", label: "Instagram" },
        { href: "https://www.linkedin.com/company/sakec-acm-student-chapter/", label: "LinkedIn" },
        { href: "https://github.com/sakec-acm", label: "GitHub" },
        { href: "mailto:support@sakec.acm.org", label: "Email" },
      ]}
      copyrightText="SAKEC ACM Student Chapter 2025. All Rights Reserved"
      barCount={20}
    />
  )
}
