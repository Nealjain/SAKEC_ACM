#!/usr/bin/env node

/**
 * Simple development API server to handle membership applications
 * This serves as a workaround for PHP files not being served in Vite dev mode
 */

const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Supabase client (using anon key for now)
const supabase = createClient(
    'https://dhxzkzdlsszwuqjkicnv.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoeHpremRsc3N6d3VxamtpY252Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNTYyNjksImV4cCI6MjA3MDgzMjI2OX0.ofq619iAaQPW33zm_6uG6-r9UDg6tU7EF8krqZWlLOs'
);

// GET /api/membership-applications - Fetch all applications
app.get('/api/membership-applications', async (req, res) => {
    try {
        console.log('Fetching membership applications...');
        
        const { data, error } = await supabase
            .from('membership_applications')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Supabase error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch applications',
                error: error.message
            });
        }

        console.log(`Found ${data?.length || 0} applications`);
        
        res.json({
            success: true,
            data: data || []
        });
        
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// PUT /api/membership-applications - Update application status
app.put('/api/membership-applications', async (req, res) => {
    try {
        const { id, status } = req.body;
        
        if (!id || !status) {
            return res.status(400).json({
                success: false,
                message: 'ID and status are required'
            });
        }
        
        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }
        
        console.log(`Updating application ${id} to status: ${status}`);
        
        const { error } = await supabase
            .from('membership_applications')
            .update({ 
                status: status,
                updated_at: new Date().toISOString()
            })
            .eq('id', id);

        if (error) {
            console.error('Update error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to update application status',
                error: error.message
            });
        }

        res.json({
            success: true,
            message: 'Application status updated successfully'
        });
        
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Development API server is running' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Development API server running on http://localhost:${PORT}`);
    console.log(`📋 Membership applications endpoint: http://localhost:${PORT}/api/membership-applications`);
});