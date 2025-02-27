import { themeData } from '@constants/roomTheme';
import { motion } from 'framer-motion';
import { useState } from 'react';
import DockMenu from './components/DockMenu';
import PreferenceSetting from './components/PreferenceSetting';
import RoomModel from './components/RoomModel';
import ThemeSetting from './components/ThemeSetting';
import { useUserStore } from '../../store/useUserStore';

const animationVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 130,
      damping: 18,
    },
  },
};

export default function RoomPage() {
  const [activeSettings, setActiveSettings] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState('basic');

  const user = useUserStore((state) => state.user);

  const handleSettingsChange = (setting) => {
    setActiveSettings(activeSettings === setting ? null : setting);
  };

  const handleThemeChange = (newTheme) => {
    setSelectedTheme(newTheme);
  };

  return (
    <main className='relative w-full min-h-screen overflow-hidden main-background'>
      <RoomModel
        userId={user.userId}
        roomId={user.roomId}
        modelPath={themeData[selectedTheme].modelPath}
        activeSettings={activeSettings}
      />

      <DockMenu
        activeSettings={activeSettings}
        onSettingsChange={handleSettingsChange}
      />
      {activeSettings === 'theme' && (
        <motion.div
          initial='hidden'
          animate='visible'
          variants={animationVariants}
          className='w-full absolute top-0 left-0 z-30'>
          <ThemeSetting
            selectedTheme={selectedTheme}
            onThemeSelect={handleThemeChange}
          />
        </motion.div>
      )}
      {activeSettings === 'preference' && (
        <motion.div
          initial='hidden'
          animate='visible'
          variants={animationVariants}
          className='w-full absolute top-0 left-0 z-30'>
          <PreferenceSetting />
        </motion.div>
      )}
    </main>
  );
}
