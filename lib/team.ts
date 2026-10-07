export type TeamMember = {
  name: string;
  role: string;
  image: string;
};

export const stats = [
  { value: "500+", label: "Happy customers", caption: "and counting" },
  { value: "11+", label: "Vehicles in fleet", caption: "and growing" },
  { value: "3", label: "Pickup locations", caption: "across Tasmania" },
  { value: "100%", label: "Tasmanian owned", caption: "& operated" },
];

export const team: TeamMember[] = [
  { name: "Marcus Webb", role: "Founder & Director", image: "/tour-car-1.jpg" },
  { name: "Jade Morrison", role: "Customer Experience Manager", image: "/tour-car-2.jpg" },
  { name: "Ben Cartwright", role: "Fleet & Operations", image: "/tour-car-3.jpg" },
  { name: "Anika Sharma", role: "Accident Replacement Coordinator", image: "/car-4.jpg" },
];