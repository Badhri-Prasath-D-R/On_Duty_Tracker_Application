import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, ShieldCheck, ArrowRight } from "lucide-react";
import Hyperspeed from '../components/hs';
import TiltedCard from '../components/TiltedCard';
import studentLogo from "./studentlogoo.png";
import TextType from "../components/typewriter";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] relative flex items-center justify-center antialiased overflow-hidden">
      
      {/* Background Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none w-full h-full">
        <Hyperspeed
          effectOptions={{
            distortion: "turbulentDistortion",
            length: 400,
            roadWidth: 10,
            islandWidth: 2,
            lanesPerRoad: 3,
            fov: 120,
            fovSpeedUp: 150,
            speedUp: 2,
            carLightsFade: 0.4,
            totalSideLightSticks: 20,
            lightPairsPerRoadWay: 40,
            shoulderLinesWidthPercentage: 0.05,
            brokenLinesWidthPercentage: 0.1,
            brokenLinesLengthPercentage: 0.5,
            lightStickWidth: [0.12, 0.5],
            lightStickHeight: [1.3, 1.7],
            movingAwaySpeed: [60, 80],
            movingCloserSpeed: [-120, -160],
            carLightsLength: [12, 80],
            carLightsRadius: [0.05, 0.14],
            carWidthPercentage: [0.3, 0.5],
            carShiftX: [-0.8, 0.8],
            carFloorSeparation: [0, 5],
            colors: {
              roadColor: 0x080808,
              islandColor: 0x0a0a0a,
              background: 0x000000,
              shoulderLines: 0x131318,
              brokenLines: 0x131318,
              leftCars: [0xd856bf, 0x6750a2, 0xc247ac],
              rightCars: [0x03b3c3, 0x0e5ea5, 0x324555],
              sticks: 0x03b3c3,
            },
          }}
        />
      </div>

      {/* Content Layer */}
      <div className="relative z-20 w-full flex flex-col items-center justify-center px-4 py-8">
        
        {/* Title Section */}
        {/* Main Title - Centered */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-center mb-20 w-full"
        >
          {/* OD-TRACKER with enhanced glow */}
          
          <div className="text-glow-strong">
            <TextType
              text={["OD-TRACKER"]}
              typingSpeed={75}
              initialDelay={500}
              pauseDuration={2000}
              loop={false}
              showCursor={false}
            />
          </div>

          {/* Chennai Institute of Technology with glow */}
          <div className="text-white uppercase tracking-[0.3em] md:tracking-[0.4em] text-base md:text-lg lg:text-xl font-black mt-8">
            <div className="text-glow-moderate">
              <TextType
                text={["Chennai Institute of Technology"]}
                typingSpeed={50}
                initialDelay={1500}
                pauseDuration={3000}
                loop={false}
                showCursor={false}
              />
            </div>
          </div>
        </motion.div>

        {/* Cards Container */}
        <div className="flex flex-row flex-wrap justify-center gap-8 items-center w-full max-w-7xl">

          {/* ================= STUDENT CARD ================= */}
          {/* Student Card */}
          <motion.div
            className="cursor-pointer relative group"
            onClick={() => navigate("/Studentpage")}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.5 }}
          >
            {/* Enhanced Glow Border */}
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-blue-500/40 via-cyan-500/40 to-blue-500/40 blur-xl opacity-80 
                            group-hover:opacity-100 group-hover:blur-2xl group-hover:-inset-5
                            transition-all duration-500 animate-pulse-border" />
            
            {/* Inner Glow */}
            <div className="absolute inset-0 rounded-2xl border-2 border-blue-400/30 group-hover:border-blue-300/50 transition-all duration-300" />

            <div className="relative">
              <TiltedCard
                imageSrc={studentLogo}
                containerHeight="500px"
                containerWidth="600px"
                imageHeight="420px"
                imageWidth="400px"
                rotateAmplitude={12}
                scaleOnHover={1.05}
                showTooltip={false}
                showMobileWarning={false}
                displayOverlayContent={true}
                overlayContent={
                  <div className="w-[390px] h-[400px] p-8 rounded-2xl bg-gradient-to-br from-black/90 via-gray-900/90 to-black/90 backdrop-blur-xl flex flex-col items-center justify-center text-center shadow-2xl border border-blue-500/20 group-hover:border-blue-400/40 transition-all duration-300">
                    <div className="relative mb-6">
                      <GraduationCap className="text-blue-400 mb-4 group-hover:text-blue-300 transition-colors duration-300" size={56} />
                      <div className="absolute inset-0 bg-blue-500/30 blur-2xl rounded-full group-hover:bg-blue-400/40 transition-all duration-300" />
                    </div>

                    <h2 className="text-3xl font-extrabold text-white mb-3 uppercase tracking-wider animate-pulse-text">
                      Student Portal
                    </h2>

                    <p className="text-gray-100 text-lg mb-8 px-4 font-medium">
                      Apply and track your On-Duty requests in real-time.
                    </p>

                    <div className="flex items-center gap-2 text-blue-300 font-bold text-sm uppercase tracking-widest bg-gradient-to-r from-blue-900/40 to-cyan-900/40 px-6 py-3 rounded-full border border-blue-500/40 group-hover:border-blue-400/60 group-hover:from-blue-800/50 group-hover:to-cyan-800/50 transition-all duration-300">
                      Enter Portal <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                }
              />
            </div>
          </motion.div>

          {/* ================= FACULTY CARD ================= */}
          {/* Faculty Card */}
          <motion.div
            className="cursor-pointer relative group"
            onClick={() => navigate("/facultypage")}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.8 }}
          >
            {/* Enhanced Glow Border */}
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-purple-500/40 via-pink-500/40 to-purple-500/40 blur-xl opacity-80 
                            group-hover:opacity-100 group-hover:blur-2xl group-hover:-inset-5
                            transition-all duration-500 animate-pulse-border" />
            
            {/* Inner Glow */}
            <div className="absolute inset-0 rounded-2xl border-2 border-purple-400/30 group-hover:border-purple-300/50 transition-all duration-300" />

            <div className="relative">
              <TiltedCard
                imageSrc={studentLogo}
                containerHeight="500px"
                containerWidth="600px"
                imageHeight="420px"
                imageWidth="400px"
                rotateAmplitude={12}
                scaleOnHover={1.05}
                showTooltip={false}
                showMobileWarning={false}
                displayOverlayContent={true}
                overlayContent={
                  <div className="w-[390px] h-[400px] p-8 rounded-2xl bg-gradient-to-br from-black/90 via-gray-900/90 to-black/90 backdrop-blur-xl flex flex-col items-center justify-center text-center shadow-2xl border border-purple-500/20 group-hover:border-purple-400/40 transition-all duration-300">
                    <div className="relative mb-6">
                      <ShieldCheck className="text-purple-400 mb-4 group-hover:text-purple-300 transition-colors duration-300" size={56} />
                      <div className="absolute inset-0 bg-purple-500/30 blur-2xl rounded-full group-hover:bg-purple-400/40 transition-all duration-300" />
                    </div>

                    <h2 className="text-3xl font-extrabold text-white mb-3 uppercase tracking-wider animate-pulse-text">
                      Faculty Portal
                    </h2>

                    <p className="text-gray-100 text-lg mb-8 px-4 font-medium">
                      Review, verify, and approve pending OD applications.
                    </p>

                    <div className="flex items-center gap-2 text-purple-300 font-bold text-sm uppercase tracking-widest bg-gradient-to-r from-purple-900/40 to-pink-900/40 px-6 py-3 rounded-full border border-purple-500/40 group-hover:border-purple-400/60 group-hover:from-purple-800/50 group-hover:to-pink-800/50 transition-all duration-300">
                      Access Panel <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                }
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
