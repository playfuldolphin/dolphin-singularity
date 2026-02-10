# Email Drip Campaigns

## Overview

Automated email sequences to nurture subscribers, convert donors, and engage members.

## Campaigns

### 1. Welcome Series (5 emails, 7 days)
**Trigger**: New newsletter signup
**Goal**: Introduce mission, build relationship, convert to donor/member

| Day | Subject | Goal | Conversion CTA |
|-----|---------|------|----------------|
| 0 | Welcome to the Pod | Engagement | Explore site |
| 1 | Most Groundbreaking Discovery | Education | Read research |
| 3 | How YOU Can Help | Participation | Submit encounter |
| 5 | Real Dolphin-Human Conversation | Inspiration + Conversion | Membership/Donate |
| 7 | Behind the Scenes | Community | Follow social |

**Expected Metrics**:
- Open rate: 45-55%
- Click rate: 15-25%
- Conversion to donor: 5-8%
- Conversion to member: 2-4%

### 2. Donor Nurture Series (4 emails, 90 days)
**Trigger**: First donation
**Goal**: Thank, show impact, convert to monthly

| Day | Subject | Goal | Conversion CTA |
|-----|---------|------|----------------|
| 0 | Thank You - Impact Starts TODAY | Gratitude + Impact | Monthly membership |
| 7 | Week 1 Impact Report | Proof of impact | Monthly supporter |
| 30 | 30 Days: The Ripple Effect | Major win attribution | Monthly partner |
| 90 | Personal Note from Dr. Chen | Relationship + Conversion | Convert to monthly |

**Expected Metrics**:
- Open rate: 55-65%
- One-time to monthly conversion: 15-20%
- Second donation: 25-30%
- Referral rate: 10-15%

### 3. Member Onboarding (Coming Soon)
**Trigger**: New membership signup
**Goal**: Activate benefits, increase engagement, reduce churn

### 4. Re-engagement (Coming Soon)
**Trigger**: 60 days no open
**Goal**: Win back inactive subscribers

### 5. Research Updates (Coming Soon)
**Trigger**: Monthly
**Goal**: Keep engaged, showcase impact

## Implementation Guide

### Option 1: ConvertKit (Recommended)
**Why**: Built for creators, visual automation builder, great deliverability

**Setup Steps**:
1. Sign up at https://convertkit.com
2. Create a form for newsletter signup
3. Import email sequences from JSON files
4. Create automations:
   - Trigger: Form signup → Welcome Series
   - Trigger: Tag "donor" → Donor Series
5. Add tracking pixels to pages
6. Test sequences thoroughly

**Cost**: 
- Free up to 1,000 subscribers
- $29/month for up to 3,000
- $49/month for up to 5,000

### Option 2: Mailchimp
**Why**: Industry standard, powerful features, lots of integrations

**Setup Steps**:
1. Sign up at https://mailchimp.com
2. Create audiences
3. Build automation workflows
4. Import content from JSON
5. Set up triggers and delays

**Cost**:
- Free up to 500 contacts
- $13/month for up to 500 (with automation)
- $20/month for up to 1,500

### Option 3: Buttondown (Current Provider)
**Why**: Simple, markdown-friendly, affordable

**Setup Steps**:
1. Already configured for newsletter
2. Add automation feature ($9/month extra)
3. Create sequences manually
4. Set up webhooks for triggers

**Cost**:
- $9/month base + $9/month automation

## Email Templates

All emails follow this structure:

```markdown
Subject: [Emoji] Clear benefit/intrigue

Preview text: Expand on subject, create curiosity

---

Greeting: Personalized with {first_name}

Hook: 1-2 sentences that grab attention

Body:
- Short paragraphs (2-3 sentences max)
- Bullet points for scannability
- Bold for emphasis
- Links to relevant content

CTA: Clear, single primary action

Signature: Personal, from real person

P.S.: Additional hook or urgency
```

## Personalization Variables

Available in all campaigns:
- `{first_name}` - Subscriber's first name
- `{email}` - Email address
- `{signup_date}` - When they subscribed
- `{amount}` - Donation amount (donor series only)
- `{donation_impact}` - Calculated impact (donor series only)
- `{monthly_equivalent}` - Monthly equivalent of one-time donation
- `{member_tier}` - Membership level (member series only)

## Conversion Funnels

### Subscriber → Donor
1. Welcome email (Day 0) - Introduce mission
2. Discovery email (Day 1) - Show impact
3. Involvement email (Day 3) - Get them participating
4. **ASK email (Day 5)** - Clear donation CTA
5. Community email (Day 7) - Nurture relationship

Expected conversion: 5-8% become donors within 30 days

### Donor → Monthly Member
1. Thank you (Day 0) - Instant gratification
2. Impact report (Day 7) - Show results
3. **Major win (Day 30)** - Attribute success to their gift
4. Personal appeal (Day 90) - Direct ask from founder

Expected conversion: 15-20% convert to monthly within 90 days

### Monthly Member → Higher Tier
1. Engagement emails showcasing higher tier benefits
2. "Upgrade" offers with limited-time bonuses
3. Personal outreach from team members

Expected: 10-15% upgrade within 6 months

## Segmentation Strategy

### By Engagement:
- **Hot** (opened last 3 emails) - Send more frequently
- **Warm** (opened 1-2 of last 3) - Normal cadence
- **Cold** (0 opens in last 3) - Re-engagement campaign

### By Action:
- **Subscribers** - Welcome series
- **Donors** - Donor nurture series
- **Members** - Member onboarding + exclusive content
- **Lapsed** - Win-back campaigns

### By Interest (based on clicks):
- **Research focused** - More science content
- **Conservation focused** - More action/advocacy content
- **Technology focused** - More AI/tech details
- **General interest** - Balanced content

## A/B Testing Ideas

### Subject Lines:
- Emoji vs no emoji
- Question vs statement
- Curiosity vs benefit
- Personal vs organizational voice

### Send Times:
- 10am vs 2pm vs 7pm
- Tuesday vs Thursday vs Saturday
- Immediate vs delayed triggers

### Content:
- Short (3 paragraphs) vs long (8 paragraphs)
- Stories vs data
- Single CTA vs multiple CTAs
- Founder voice vs team voice

## Success Metrics

### Email Performance:
- **Open rate**: 40%+ (industry avg: 21%)
- **Click rate**: 10%+ (industry avg: 2.6%)
- **Unsubscribe rate**: <0.5% per email
- **Spam complaint rate**: <0.1%

### Campaign Performance:
- **Welcome series conversion**: 5-8% to donor
- **Donor series conversion**: 15-20% to monthly
- **Monthly retention**: 90%+ after 3 months
- **Annual retention**: 70%+ after 12 months

### Revenue Impact:
- **Email-attributed donations**: 30-40% of total
- **Email-attributed memberships**: 50-60% of total
- **Average value per subscriber**: $15-25/year
- **Lifetime value**: $75-150 (over 3 years)

## Automation Triggers

### Form Submits:
- Newsletter signup → Welcome Series
- Encounter form → Thank you + community invite
- Contact form → Personal follow-up

### E-commerce:
- First donation → Donor Series
- Membership purchase → Member Onboarding
- Abandoned checkout → Recovery sequence

### Behavioral:
- Downloaded resource → Related content
- Watched video 75%+ → Deep-dive content
- Visited pricing 3x → Sales email

### Time-based:
- 30 days since donation → Impact update
- 60 days no open → Re-engagement
- 1 year anniversary → Thank you + ask

## Legal Compliance

### CAN-SPAM Requirements:
- ✅ Clear unsubscribe link in every email
- ✅ Physical mailing address in footer
- ✅ Honest subject lines
- ✅ Honor unsubscribe requests within 10 days

### GDPR Compliance:
- ✅ Double opt-in for EU subscribers
- ✅ Clear privacy policy
- ✅ Easy data export/deletion
- ✅ Lawful basis for processing

### Best Practices:
- ✅ Never buy email lists
- ✅ Clear consent at signup
- ✅ Separate transactional from marketing emails
- ✅ Include preference center (not just unsubscribe)

## Quick Start Guide

1. **Week 1**: Set up email provider account
2. **Week 2**: Import welcome series, create signup form
3. **Week 3**: Add form to website, test automation
4. **Week 4**: Import donor series, configure triggers
5. **Week 5**: Launch! Monitor metrics daily

## Support

Need help? Email: dolphinsingularity@gmail.com

---

**Last Updated**: November 26, 2025
**Version**: 1.0
