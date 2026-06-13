import React from "react";

import HomeSection from "../sections/HomeSection";
import AboutSection from "../sections/AboutSection";
import ProblemSolutionSection from "../sections/ProblemSolutionSection";
import FeaturesSection from "../sections/FeaturesSection";
import PitchDeckSection from "../sections/PitchDeckSection";
import FounderStorySection from "../sections/FounderStorySection";
import RoadmapSection from "../sections/RoadmapSection";
import DonationSection from "../sections/DonationSection";
import WaitlistSection from "../sections/WaitlistSection";
import PartnerSection from "../sections/PartnerSection";
import ContactSection from "../sections/ContactSection";
import FooterSection from "../sections/FooterSection";

const HomePage = () => {
  // 🔍 Check each import's type
  console.log("HomeSection:", typeof HomeSection);
  console.log("AboutSection:", typeof AboutSection);
  console.log("ProblemSolutionSection:", typeof ProblemSolutionSection);
  console.log("FeaturesSection:", typeof FeaturesSection);
  console.log("PitchDeckSection:", typeof PitchDeckSection);
  console.log("FounderStorySection:", typeof FounderStorySection);
  console.log("RoadmapSection:", typeof RoadmapSection);
  console.log("DonationSection:", typeof DonationSection);
  console.log("WaitlistSection:", typeof WaitlistSection);
  console.log("PartnerSection:", typeof PartnerSection);
  console.log("ContactSection:", typeof ContactSection);
  console.log("FooterSection:", typeof FooterSection);

  return (
    <div>
      <HomeSection />
      <AboutSection />
      <ProblemSolutionSection />
      <FeaturesSection />
      <PitchDeckSection />
      <FounderStorySection />
      <RoadmapSection />
      <DonationSection />
      <WaitlistSection />
      <PartnerSection />
      <ContactSection />
      <FooterSection />
    </div>
  );
};

export default HomePage;