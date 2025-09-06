// import React, { useRef, useEffect, useState } from "react";
// import Webcam from "react-webcam";
// import { motion, AnimatePresence } from "framer-motion";
// import { Camera, CameraOff } from "lucide-react";
// import { Alert, AlertSystem } from "./AlertSystem";

// export interface EmotionData {
//   faceCount: number;
//   headPose: { 
//     direction: string; 
//     horizontal: string; 
//     vertical: string; 
//   };
//   emotions: Record<string, number>;
//   timestamp: number;
// }

// interface WebcamMonitorProps {
//   isActive: boolean;
//   onFrameCapture: (frameData: string) => void;
//   emotionData: EmotionData | null;
// }

// export const WebcamMonitor: React.FC<WebcamMonitorProps> = ({
//   isActive,
//   onFrameCapture,
//   emotionData,
// }) => {
//   const webcamRef = useRef<Webcam>(null);
//   const [hasPermission, setHasPermission] = useState(false);
//   const [newAlert, setNewAlert] = useState<Alert | null>(null);

//   // -----------------------------
//   // Request camera permission
//   // -----------------------------
//   useEffect(() => {
//     if (isActive) {
//       navigator.mediaDevices
//         .getUserMedia({ video: true })
//         .then(() => setHasPermission(true))
//         .catch(() => setHasPermission(false));
//     }
//   }, [isActive]);

//   // -----------------------------
//   // Capture frames every 1s
//   // -----------------------------
//   useEffect(() => {
//     if (!isActive || !hasPermission) return;

//     const interval = setInterval(() => {
//       if (webcamRef.current) {
//         const imageSrc = webcamRef.current.getScreenshot();
//         if (imageSrc) onFrameCapture(imageSrc);
//       }
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [isActive, hasPermission, onFrameCapture]);

//   // -----------------------------
//   // Alerts for headpose & face count
//   // -----------------------------
//   useEffect(() => {
//     if (!emotionData) return;

//     const { headPose, faceCount } = emotionData;

//     // Head turned away from straight position
//     if (headPose.horizontal === "left" || headPose.horizontal === "right") {
//       setNewAlert({
//         id: Date.now(),
//         message: `⚠️ Head turned ${headPose.horizontal}`,
//         type: "warning",
//       });
//     }

//     // Head tilted up or down significantly
//     if (headPose.vertical === "up" || headPose.vertical === "down") {
//       setNewAlert({
//         id: Date.now(),
//         message: `⚠️ Head tilted ${headPose.vertical}`,
//         type: "warning",
//       });
//     }

//     // Head not facing straight (overall direction)
//     if (headPose.direction !== "straight") {
//       setNewAlert({
//         id: Date.now(),
//         message: `⚠️ Look ${headPose.direction === "straight" ? "forward" : headPose.direction}`,
//         type: "info",
//       });
//     }

//     // No face detected
//     if (faceCount === 0) {
//       setNewAlert({
//         id: Date.now(),
//         message: "⚠️ No face detected!",
//         type: "error",
//       });
//     }

//     // More than one face
//     if (faceCount > 1) {
//       setNewAlert({
//         id: Date.now(),
//         message: "⚠️ Multiple faces detected!",
//         type: "error",
//       });
//     }
//   }, [emotionData]);

//   // Helper function to get direction icon
//   const getDirectionIcon = (direction: string) => {
//     switch (direction) {
//       case "left": return "←";
//       case "right": return "→";
//       case "up": return "↑";
//       case "down": return "↓";
//       case "straight": return "●";
//       default: return "●";
//     }
//   };

//   // Helper function to get direction color
//   const getDirectionColor = (direction: string) => {
//     switch (direction) {
//       case "straight": return "#10B981"; // Green
//       case "left":
//       case "right": return "#F59E0B"; // Amber
//       case "up":
//       case "down": return "#EF4444"; // Red
//       default: return "#6B7280"; // Gray
//     }
//   };

//   if (!isActive) return null;

//   const emotionColors: Record<string, string> = {
//     happy: "#10B981",
//     neutral: "#6B7280",
//     sad: "#3B82F6",
//     fearful: "#8B5CF6",
//     thinking: "#F59E0B",
//     confused: "#EF4444",
//   };

//   return (
//     <>
//       {/* Alerts at the top */}
//       <AlertSystem newAlert={newAlert} />

//       <AnimatePresence>
//         {isActive && (
//           <motion.div
//             initial={{ opacity: 0, scale: 0.8 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.8 }}
//             className="fixed bottom-4 right-4 z-50 w-64 sm:w-72"
//           >
//             <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
//               {/* Header */}
//               <div className="bg-gray-800 text-white px-3 py-2 flex items-center gap-2">
//                 <Camera size={16} />
//                 <span className="text-sm font-medium">Monitoring</span>
//                 <div className="flex items-center gap-1 ml-auto">
//                   <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//                   <span className="text-xs">Live</span>
//                 </div>
//               </div>

//               {/* Webcam */}
//               <div className="relative">
//                 {hasPermission ? (
//                   <Webcam
//                     ref={webcamRef}
//                     width={256}
//                     height={192}
//                     screenshotFormat="image/jpeg"
//                     className="block"
//                   />
//                 ) : (
//                   <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
//                     <div className="text-center">
//                       <CameraOff
//                         size={24}
//                         className="text-gray-400 mx-auto mb-2"
//                       />
//                       <p className="text-xs text-gray-500">Camera access denied</p>
//                     </div>
//                   </div>
//                 )}

//                 {/* Head Pose and Emotion Data BELOW Webcam */}
//                 {emotionData && (
//                   <div className="bg-black bg-opacity-70 text-white p-2 mt-2 rounded-b-lg">
//                     {/* Face Count and Head Direction */}
//                     <div className="text-xs mb-2 flex items-center justify-between">
//                       <span>Faces: {emotionData.faceCount}</span>
//                       <div className="flex items-center gap-2">
//                         <span>Head:</span>
//                         <div className="flex items-center gap-1">
//                           <span 
//                             className="text-sm font-bold"
//                             style={{ color: getDirectionColor(emotionData.headPose.direction) }}
//                           >
//                             {getDirectionIcon(emotionData.headPose.direction)}
//                           </span>
//                           <span className="capitalize text-xs">
//                             {emotionData.headPose.direction}
//                           </span>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Detailed Head Pose */}
//                     <div className="text-xs mb-2 flex justify-between">
//                       <div className="flex items-center gap-1">
//                         <span>H:</span>
//                         <span 
//                           className="font-bold"
//                           style={{ color: getDirectionColor(emotionData.headPose.horizontal) }}
//                         >
//                           {getDirectionIcon(emotionData.headPose.horizontal)}
//                         </span>
//                         <span className="capitalize">
//                           {emotionData.headPose.horizontal}
//                         </span>
//                       </div>
//                       <div className="flex items-center gap-1">
//                         <span>V:</span>
//                         <span 
//                           className="font-bold"
//                           style={{ color: getDirectionColor(emotionData.headPose.vertical) }}
//                         >
//                           {getDirectionIcon(emotionData.headPose.vertical)}
//                         </span>
//                         <span className="capitalize">
//                           {emotionData.headPose.vertical}
//                         </span>
//                       </div>
//                     </div>

//                     {/* Emotions and Gestures */}
//                     <div className="space-y-1">
//                       {Object.entries(emotionData.emotions).map(
//                         ([emotion, value]) => (
//                           <div key={emotion} className="flex items-center gap-2">
//                             <span className="text-xs w-14 capitalize">
//                               {emotion}
//                             </span>
//                             <div className="flex-1 bg-gray-600 rounded-full h-1">
//                               <div
//                                 className="h-full rounded-full transition-all duration-300"
//                                 style={{
//                                   width: `${value * 100}%`,
//                                   backgroundColor:
//                                     emotionColors[
//                                       emotion as keyof typeof emotionColors
//                                     ],
//                                 }}
//                               />
//                             </div>
//                             <span className="text-xs w-8">
//                               {Math.round(value * 100)}
//                             </span>
//                           </div>
//                         )
//                       )}
//                     </div>
                    
//                     {/* Timestamp */}
//                     <div className="text-xs mt-1 text-gray-300">
//                       {new Date(emotionData.timestamp * 1000).toLocaleTimeString()}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </>
//   );
// };

import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, CameraOff } from "lucide-react";
import { Alert, AlertSystem } from "./AlertSystem";

export interface EmotionData {
  faceCount: number;
  headPose: {
    direction: string;
    horizontal: string;
    vertical: string;
  };
  emotions: Record<string, number>;
  timestamp: number;
}

interface WebcamMonitorProps {
  isActive: boolean;
  onFrameCapture: (frameData: string) => void;
  emotionData: EmotionData | null;
}

export const WebcamMonitor: React.FC<WebcamMonitorProps> = ({
  isActive,
  onFrameCapture,
  emotionData,
}) => {
  const webcamRef = useRef<Webcam>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [newAlert, setNewAlert] = useState<Alert | null>(null);

  // -----------------------------
  // Request camera permission
  // -----------------------------
  useEffect(() => {
    if (isActive) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(() => setHasPermission(true))
        .catch(() => setHasPermission(false));
    }
  }, [isActive]);

  // -----------------------------
  // Capture frames every 1s
  // -----------------------------
  useEffect(() => {
    if (!isActive || !hasPermission) return;

    const interval = setInterval(() => {
      if (webcamRef.current) {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) onFrameCapture(imageSrc);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, hasPermission, onFrameCapture]);

  // -----------------------------
  // Alerts for headpose & face count
  // -----------------------------
  useEffect(() => {
    if (!emotionData) return;

    const { headPose, faceCount } = emotionData;

    // Priority: errors > info
    if (faceCount === 0) {
      setNewAlert({
        id: Date.now(),
        message: "⚠️ No face detected!",
        type: "error",
      });
      return;
    } else if (faceCount > 1) {
      setNewAlert({
        id: Date.now(),
        message: "⚠️ Multiple faces detected!",
        type: "error",
      });
      return;
    }

    // Head turned or tilted
    if (headPose.horizontal !== "straight") {
      setNewAlert({
        id: Date.now(),
        message: `⚠️ Head turned ${headPose.horizontal}`,
        type: "info",
      });
    } else if (headPose.vertical !== "straight") {
      setNewAlert({
        id: Date.now(),
        message: `⚠️ Head tilted ${headPose.vertical}`,
        type: "info",
      });
    } else if (headPose.direction !== "straight") {
      setNewAlert({
        id: Date.now(),
        message: `⚠️ Look ${headPose.direction}`,
        type: "info",
      });
    }
  }, [emotionData]);

  // Helper functions for head direction icons & colors
  const getDirectionIcon = (dir: string) => ({
    left: "←",
    right: "→",
    up: "↑",
    down: "↓",
    straight: "●",
  }[dir] || "●");

  const getDirectionColor = (dir: string) => ({
    straight: "#10B981",
    left: "#F59E0B",
    right: "#F59E0B",
    up: "#EF4444",
    down: "#EF4444",
  }[dir] || "#6B7280");

  if (!isActive) return null;

  const emotionColors: Record<string, string> = {
    happy: "#10B981",
    neutral: "#6B7280",
    sad: "#3B82F6",
    fearful: "#8B5CF6",
    thinking: "#F59E0B",
    confused: "#EF4444",
  };

  return (
    <>
      {/* Alert System */}
      <AlertSystem newAlert={newAlert} />

      {/* Monitoring Panel */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 right-4 z-50 w-64 sm:w-72"
          >
            <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="bg-gray-800 text-white px-3 py-2 flex items-center gap-2">
                <Camera size={16} />
                <span className="text-sm font-medium">Monitoring</span>
                <div className="flex items-center gap-1 ml-auto">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs">Live</span>
                </div>
              </div>

              {/* Webcam */}
              <div className="relative">
                {hasPermission ? (
                  <Webcam
                    ref={webcamRef}
                    width={256}
                    height={192}
                    screenshotFormat="image/jpeg"
                    className="block"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                    <div className="text-center">
                      <CameraOff
                        size={24}
                        className="text-gray-400 mx-auto mb-2"
                      />
                      <p className="text-xs text-gray-500">Camera access denied</p>
                    </div>
                  </div>
                )}

                {/* Emotion & Head Pose Overlay */}
                {emotionData && (
                  <div className="bg-black bg-opacity-70 text-white p-2 mt-2 rounded-b-lg text-xs space-y-1">
                    <div className="flex justify-between">
                      <span>Faces: {emotionData.faceCount}</span>
                      <span>
                        Head:{" "}
                        <span
                          className="font-bold"
                          style={{
                            color: getDirectionColor(emotionData.headPose.direction),
                          }}
                        >
                          {getDirectionIcon(emotionData.headPose.direction)}
                        </span>{" "}
                        {emotionData.headPose.direction}
                      </span>
                    </div>

                    {/* Horizontal & Vertical */}
                    <div className="flex justify-between">
                      <span>
                        H:{" "}
                        <span
                          className="font-bold"
                          style={{
                            color: getDirectionColor(emotionData.headPose.horizontal),
                          }}
                        >
                          {getDirectionIcon(emotionData.headPose.horizontal)}
                        </span>{" "}
                        {emotionData.headPose.horizontal}
                      </span>
                      <span>
                        V:{" "}
                        <span
                          className="font-bold"
                          style={{
                            color: getDirectionColor(emotionData.headPose.vertical),
                          }}
                        >
                          {getDirectionIcon(emotionData.headPose.vertical)}
                        </span>{" "}
                        {emotionData.headPose.vertical}
                      </span>
                    </div>

                    {/* Emotions */}
                    {Object.entries(emotionData.emotions).map(([e, v]) => (
                      <div key={e} className="flex items-center gap-2">
                        <span className="capitalize w-14">{e}</span>
                        <div className="flex-1 bg-gray-600 rounded-full h-1">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${v * 100}%`,
                              backgroundColor: emotionColors[e] || "#6B7280",
                            }}
                          />
                        </div>
                        <span className="w-8 text-right">{Math.round(v * 100)}</span>
                      </div>
                    ))}

                    {/* Timestamp */}
                    <div className="text-gray-300 text-right mt-1">
                      {new Date(emotionData.timestamp * 1000).toLocaleTimeString()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
