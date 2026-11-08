// FAQs exactly as supplied by the client (PDF "changes and FAQ and terms and coditions"), in their two categories.
// Answers use the markup from lib/rich-text. Keep the client's wording; change it only with their approval.

export const faqCategories = ["Regular Rentals", "Accident Replacement Vehicles"] as const;

export type FaqCategory = (typeof faqCategories)[number];

export type Faq = { question: string; answer: string };

export const faqs: Record<FaqCategory, Faq[]> = {
  "Regular Rentals": [
    {
      question: "How old do I have to be to rent a vehicle?",
      answer: "To rent a vehicle from TasDrive Rentals, all renters and authorised operators must be a minimum of **21 years of age** at the commencement of the rental.",
    },
    {
      question: "What driver’s licence do I require to hire a vehicle?",
      answer: `TasDrive Rentals accepts current, valid Australian and international licences appropriate for the class of vehicle.
- **Physical Requirement:** We strictly reject digital photographs, photocopies, or unverified images. You must present your original, physical licence (or an official digital licence) at the counter.
- **English Translation:** If your international licence is not written in English, it must be accompanied by a valid International Driving Permit (IDP) or a professional translation certified by NAATI.
- **Licence Type Restrictions:** Learner permit holders (L-Plates) are strictly barred from driving. Provisional (P1/P2) and Probationary drivers are allowed only if explicitly approved by us,
- **The Tasmanian Residency 6-Month Rule:** Pursuant to Tasmanian Transport Services regulations, if you move to Tasmania from interstate or gain an Australian Permanent Residency visa, you have a strict **six (6) month limit** to convert to a Tasmanian driver's licence. Past 6 months, your interstate or overseas licence is legally invalid on Tasmanian roads, and you will be ineligible to drive our vehicles. Genuine international tourists and temporary visa holders may drive on their overseas licence for the duration of their stay.`,
    },
    {
      question: "What do I need to bring to collect my TasDrive vehicle?",
      answer: `1. **Valid Driver’s Licence:** Meeting our standard licensing and age criteria.
2. **Valid Card for Payment & Bond:** A physical credit or debit card bank-issued in the main driver's name.
3. **Passport (Non-Citizens):** International renters must also present a valid international passport.
4. **Secondary Proof of Address:** You must present an official document validating your current residential address (such as a recent utility provider invoice, a registered phone bill, or a legally executed residential lease agreement).`,
    },
    {
      question: "Do I need a security bond to rent a vehicle?",
      answer: `Yes. At the start of your rental, we process a temporary financial pre-authorisation hold against your card to act as a security bond for incidental costs like fuel shortfalls, unbilled tolls, traffic penalties, or post-return damage.
- **Credit Cards:** The pre-authorisation hold is **$200**.
- **Debit Cards:** The pre-authorisation hold is **$500**.
- **Release Timeline:** TasDrive Rentals automatically releases this hold within **five business days** of the vehicle being physically returned. Once released, it may take additional time to appear in your account depending entirely on your bank's processing timelines.`,
    },
    {
      question: "What is the minimum rental period?",
      answer: "All vehicles are hired for a minimum of 24 hours. You may return the vehicle earlier, but you will still be billed for a minimum 24-hour period.",
    },
    {
      question: "Can I add an additional driver to my rental?",
      answer: "Yes! TasDrive Rentals offers a **complimentary driver allowance for your first additional driver**, who can be added completely free of charge. Any subsequent drivers added thereafter will incur a flat fee of **$14.00 per driver per booking**. All additional drivers must meet our licensing criteria and present their physical licences in person at the counter to be authorized.",
    },
    {
      question: "Can I pay for the rental car of another individual?",
      answer: "No. To prevent fraudulent transactions, the payment card and security bond must be processed on a bank-issued card matching the exact legal name of the primary authorised driver present at collection.",
    },
    {
      question: "Can I extend my rental period?",
      answer: "Extensions are subject to vehicle availability. If you need to keep the vehicle longer, you must formally notify us at least **twenty-four (24) hours before your current contract expires** so we can secure the vehicle and charge your card on file for the extra period.",
    },
    {
      question: "If I return the rental vehicle late, will I be charged an extra day?",
      answer: "Yes. If you return the Vehicle more than **one hour** after your scheduled return time without an approved 24-hour notice extension, you will automatically be charged one full day’s rental. For each subsequent 24-hour period that the vehicle remains overdue, you will be billed a further full day’s rental at the current market rate or your booked daily rate",
    },
    {
      question: "What refuelling options do I have?",
      answer: "Vehicles are provided with a full tank of fuel and should be returned full. If you choose not to refuel or run out of time, we will refuel the vehicle on your behalf and bill your card for the missing fuel at local pump prices plus the recovery fee of $30.00, you can opt to buy a \"Pre-Purchased Fuel Option\" at checkout so you can return it empty.",
    },
    {
      question: "Can I drive the rental vehicle anywhere? (Tasmanian Boundaries)",
      answer: `Because you are renting in Tasmania, the following strict geographic rules apply to protect our fleet:
- **Island Boundary:** You must keep and drive the vehicle **within Tasmania only**. The vehicle is strictly forbidden from being taken onto the Spirit of Tasmania ferry or transported onto the Australian mainland under any circumstances.
- **Banned Roadways:** The vehicle must never enter or be operated upon the **Western Explorer Road**.
- **Off-Road and Environments:** Under no circumstances can our vehicles be driven Off-Road, onto beaches, sand dunes, riverbeds, creek crossings, or flooded tracks.
- **Unsealed Routes:** On any unpaved or dirt road, unless that specific road is actively graded, commercially maintained, and presents a surface condition that guarantees safe operation without exposing the vehicle to unreasonable damage risks. Exceeding this speed threshold or driving on unmaintained dirt tracks constitutes a Major Breach of this Contract.
- **Snow Lines:** Driving above the legal snow line in alpine areas (where snow chains are legally required) is forbidden unless you have explicitly added and paid for our optional **Snow Cover** upgrade prior to your trip.`,
    },
    {
      question: "Can I reduce my damage liability for the vehicle?",
      answer: `Yes. All rentals include our Standard Cover, which carries a maximum Damage Excess of $6,000 for standard vehicles and $6,500 AUD for commercial vehicles or drivers under 25. You can choose to upgrade your coverage at checkout for peace of mind:
Medium Package: Extends protection to cover animal impacts, towing, interior damage, and storms, while reducing your out-of-pocket excess to $2,500 or $3,300 for commercial/young drivers).
Premium Package: Offers our maximum protection level with a Nil $0.00 Damage Excess excluding keys. *Note: The Premium Package is not available for drivers under the age of 25.*`,
    },
    {
      question: "Do I need to check the condition of the vehicle before I leave?",
      answer: "You bear the sole responsibility to perform a comprehensive physical inspection of the vehicle and take descriptive photographs or videos of its physical state as needed. You must verify that all pre-existing marks, chips, or damages are precisely documented on the Handover Inspection Report. Any discrepancies or unlisted defects must be reported to Us within one hour of departing our rental station.",
    },
    {
      question: "Can I rent a baby seat, child seat, or GPS system?",
      answer: "Optional accessories such as child safety seats or GPS units can be added to your booking for an additional daily fee, subject to availability. Please note that pursuant to Clause 5.5, our staff are not legally certified or permitted to install child restraints. The renter assumes full legal liability for correctly fitting, adjusting, and anchoring the safety seats.",
    },
    {
      question: "What happens if I get an infringement or parking fine?",
      answer: `You are strictly liable for all traffic infringements, speeding fines, red-light camera fines, toll evasions, and parking tickets incurred during your rental period.
The Process: When an official fine is mailed to us, we complete a legal statutory declaration nominating you to the relevant traffic authority. The authority will then reissue the fine directly to your personal address.
Our Fee: For every individual fine or infringement notice processed, TasDrive Rentals will automatically charge your payment card a non-refundable Administrative Fee`,
    },
    {
      question: "What happens if I drive on a toll road?",
      answer: `Our vehicles utilize electronic plate recognition technology that automatically logs your vehicle on active toll roads.
**Deduction Path:** You are fully liable for all infrastructure toll fees plus our mandatory service fee of **$3.30 per individual toll processed**. These charges will be calculated and automatically deducted directly from your pre-authorisation security bond prior to its release.
**Delayed Tolls:** Toll processing can sometimes lag by several weeks. If additional toll charges emerge after your security bond has been released, we reserve the right to automatically bill your credit or debit card on file.`,
    },
    {
      question: "What happens if I leave something in the vehicle?",
      answer: "TasDrive Rentals assumes zero legal liability or custodial responsibility for personal items or baggage left behind in our vehicles or offices. If our cleaning crew recovers a lost item, we will hold it for a maximum of 14 days before disposal. Please contact your return location immediately if you realize you have forgotten personal property.",
    },
    {
      question: "What should I do if I have an accident?",
      answer: `If you are involved in a collision, rollover, or if the vehicle is stolen, you must follow these strict steps. Failing to do so constitutes a Major Breach and will completely cancel your insurance cover:
1. **Notify Us Instantly:** Contact our team as soon as practicable, strictly within **twenty-four hours**.
2. **Call the Police:** Immediately report the incident to the police if anyone is injured, if a third party leaves the scene without exchanging details, or if the other driver appears impaired.
3. **Log On-Scene Evidence:** Exchange names, addresses, phone numbers, and insurance provider names with all parties. Take clear photographs of the front and back of the other driver’s licence, note down all registration numbers, and take extensive photos of the vehicle positions and damage. Gather contact details from independent witnesses.
4. **Remain with the Vehicle:** Pursuant to Clause 5.8, you must remain at the scene to safeguard the asset until our authorized towing operator arrives (unless evacuated for emergency medical care).
5. **File the Report:** You must fully execute and submit our electronic **Damage Report Form within three days** of the incident (or immediately upon returning the vehicle).
6. **No Admissions:** Do not make any admission of fault, liability, or offer financial compromises to any third party at the scene.`,
    },
    {
      question: "What if I have a breakdown or need roadside assistance?",
      answer: `- **Mechanical Faults:** If the vehicle suffers an inherent mechanical failure unrelated to driver handling, call our Emergency Helpline on **0437 793 645**. Standard roadside recovery and towing costs are fully covered by us.
- **Driver-Fault Incidents:** If you require roadside rescue due to operator error such as run-flat batteries (leaving headlights on), flat tyres, locking your keys inside the cabin, or running out of fuel—a standard **$220.00 service call-out fee** applies.
- **Roadside Protection Upgrade:** You can completely waive this $220.00 driver-error fee by purchasing our optional **Roadside Assistance Package** for an additional daily fee at the start of your hire. *Note: Fuel system contamination (putting the incorrect fuel type in the tank) completely voids all coverage protections.*`,
    },
    {
      question: "Can I tow using the rental vehicle?",
      answer: "No. Pushing, pulling, or towing any external vehicle, boat, or trailer is strictly prohibited. The sole exception is if you have obtained our explicit written approval to utilize an authorized towing apparatus owned and provided directly by TasDrive Rentals (such as a company-issued bike rack or trailer). Unauthorized towing constitutes an automatic Major Breach and immediately terminates your contract.",
    },
    {
      question: "Why do rental rates change so frequently?",
      answer: "Like airline pricing, our daily rental rates are dynamic and fluctuate based on seasonal demand, fleet availability, and how far in advance your booking is placed. To lock in the most competitive rates, we recommend booking well in advance of peak tourism windows.",
    },
    {
      question: "Do I need to clean the rental vehicle?",
      answer: "Yes. You must return the vehicle in a reasonable state of cleanliness, completely empty of personal rubbish and debris. If a vehicle is returned excessively soiled, stained, or carries an offensive odour (including tobacco or vape smoke), you will automatically be billed a specialized sanitization and deep-cleaning fee of **up to $400.00**, plus applicable Loss of Use charges while the vehicle is grounded.",
    },
    {
      question: "Can I guarantee the exact make, model, and colour of the vehicle?",
      answer: "No. While we guarantee to supply a vehicle within the exact fleet classification or size category you selected at the time of booking, we cannot guarantee a specific automotive manufacturer, model, drivetrain, or aesthetic colour. Vehicle provision is strictly subject to live fleet allocation at the time of counter collection.",
    },
  ],
  "Accident Replacement Vehicles": [
    {
      question: "Am I eligible for an accident replacement vehicle",
      answer: "You are eligible if you were not at fault in a multi vehicle accident, the at fault driver has been identified, and the at fault driver has valid car insurance.",
    },
    {
      question: "Will getting a replacement car cost me anything",
      answer: "No, there are not out of pocket hire costs for you. Under Australian law, the cost of the rental is recovered directly from the at fault drivers insurance company. You are only responsible for everyday running expenses like fuel, tolls, traffic infringements, or any new damage you cause to the vehicle.",
    },
    {
      question: "Do I need to have comprehensive insurance to apply",
      answer: "No. Your eligibility is based on legal entitlement, not your own insurance policy. Even if you only have Third Party property insurance or no insurance at all, you are still legally entitled to a replacement vehicle if you are the innocent party, the at fault driver is insured, and a claim has been lodged to generate a claim number.",
    },
    {
      question: "What type of replacement vehicle will I receive",
      answer: "You are entitled to a like for like vehicle. This means we will provide a car that closely matches the size, type, and standard of your own vehicle, whether that is a compact hatch, a family SUV, or a commercial ute.",
    },
    {
      question: "How long can I keep the replacement car",
      answer: "You can keep the vehicle for the entire duration of your car repairs. If your car is declared a total loss or a write off, you can keep the vehicle until the settlement payout has been finalized.",
    },
    {
      question: "Can anyone else drive the replacement vehicle",
      answer: "Yes. Any driver who is normally authorized to drive your own vehicle can drive the replacement car, provided they are aged 21 or older, hold a valid driver’s license, and are listed on the rental agreement.",
    },
  ],
};
