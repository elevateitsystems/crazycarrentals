export const faqCategories = ["Rental", "Accident Replacement", "General"] as const;

export type FaqCategory = (typeof faqCategories)[number];

export type Faq = { question: string; answer: string };

export const faqs: Record<FaqCategory, Faq[]> = {
  Rental: [
    {
      question: "How do I book a rental car?",
      answer:
        "Choose your vehicle from our fleet, set your pickup and return details, add any extras, and pay online. You'll receive a confirmation email straight away.",
    },
    {
      question: "What documents do I need to pick up a rental car?",
      answer:
        "Bring your current driver's licence (or a valid International Driving Permit) and the card used for the booking. All listed drivers must present their licence at pickup.",
    },
    {
      question: "Can I add another driver to my booking?",
      answer:
        "Yes. You can add an additional driver as an extra during booking. They must meet the same licence requirements and be present at pickup.",
    },
    {
      question: "Can I change or cancel my booking?",
      answer:
        "You can cancel free of charge up to 24 hours before pickup. To change your dates or vehicle, contact our team and we'll help where availability allows.",
    },
    {
      question: "What is the minimum rental age?",
      answer:
        "The minimum age is 21 years. A young driver surcharge applies to drivers under 25, and provisional or learner licences are not accepted.",
    },
    {
      question: "What is the fuel policy?",
      answer:
        "Vehicles are provided with a full tank and should be returned full. If not, a refuelling fee may apply.",
    },
    {
      question: "Is there a mileage limit?",
      answer:
        "Most rentals include generous kilometres for exploring Tasmania. Check your vehicle details at booking or ask our team about long-distance trips.",
    },
    {
      question: "What happens if I have an accident during my rental?",
      answer:
        "Make sure everyone is safe, then call our team as soon as possible. We'll guide you through the next steps and arrange assistance if needed.",
    },
  ],
  "Accident Replacement": [
    {
      question: "How does accident replacement work?",
      answer:
        "Submit your accident and contact details through our online form. We review your situation and, if you're eligible, arrange a suitable replacement vehicle.",
    },
    {
      question: "Who is eligible for a replacement vehicle?",
      answer:
        "Eligibility depends on the circumstances of your accident. Complete the eligibility form and our team will assess your situation.",
    },
    {
      question: "How long can I keep the replacement vehicle?",
      answer:
        "Typically while your vehicle is being repaired. The exact period depends on your circumstances and will be confirmed by our team.",
    },
  ],
  General: [
    {
      question: "Where are your pickup locations?",
      answer:
        "We operate from Hobart Airport, Hobart CBD and Launceston. Visit our locations page for addresses and opening hours.",
    },
    {
      question: "How can I contact your team?",
      answer:
        "Call us on (03) 6200 0000 or send a message. Our team is available Monday to Friday, 8am–6pm.",
    },
    {
      question: "Is my personal information secure?",
      answer:
        "Yes. Your information is only used to manage your booking and is never shared with third parties.",
    },
  ],
};