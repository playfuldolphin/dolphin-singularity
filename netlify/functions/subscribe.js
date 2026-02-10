/**
 * Netlify Serverless Function for Newsletter Subscription
 * Supports Mailchimp, ConvertKit, and other providers
 */

const fetch = require('node-fetch');

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { email, name } = JSON.parse(event.body);

        if (!email || !isValidEmail(email)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Valid email is required' })
            };
        }

        // Choose your provider
        const provider = process.env.NEWSLETTER_PROVIDER || 'buttondown';

        let result;
        switch (provider) {
            case 'mailchimp':
                result = await subscribeMailchimp(email, name);
                break;
            case 'convertkit':
                result = await subscribeConvertKit(email, name);
                break;
            case 'buttondown':
                result = await subscribeButtondown(email);
                break;
            default:
                throw new Error('Unsupported provider');
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                message: 'Successfully subscribed!',
                data: result
            })
        };

    } catch (error) {
        console.error('Subscription error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: error.message || 'Subscription failed'
            })
        };
    }
};

/**
 * Subscribe via Mailchimp
 */
async function subscribeMailchimp(email, name) {
    const API_KEY = process.env.MAILCHIMP_API_KEY;
    const LIST_ID = process.env.MAILCHIMP_LIST_ID;
    const DATACENTER = API_KEY.split('-')[1];

    const url = `https://${DATACENTER}.api.mailchimp.com/3.0/lists/${LIST_ID}/members`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `apikey ${API_KEY}`
        },
        body: JSON.stringify({
            email_address: email,
            status: 'subscribed',
            merge_fields: {
                FNAME: name || ''
            },
            tags: ['dolphinsingularity']
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.title || 'Mailchimp subscription failed');
    }

    return await response.json();
}

/**
 * Subscribe via ConvertKit
 */
async function subscribeConvertKit(email, name) {
    const API_KEY = process.env.CONVERTKIT_API_KEY;
    const FORM_ID = process.env.CONVERTKIT_FORM_ID;

    const response = await fetch(`https://api.convertkit.com/v3/forms/${FORM_ID}/subscribe`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            api_key: API_KEY,
            email: email,
            first_name: name || ''
        })
    });

    if (!response.ok) {
        throw new Error('ConvertKit subscription failed');
    }

    return await response.json();
}

/**
 * Subscribe via Buttondown
 */
async function subscribeButtondown(email) {
    const API_KEY = process.env.BUTTONDOWN_API_KEY;

    const response = await fetch('https://api.buttondown.email/v1/subscribers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${API_KEY}`
        },
        body: JSON.stringify({
            email: email,
            tags: ['dolphinsingularity']
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Buttondown subscription failed');
    }

    return await response.json();
}

/**
 * Validate email format
 */
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}
