import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

const ICON_CLASS_NAME = 'h-5 w-5';

export function SunIcon() {
  return <LightModeOutlinedIcon className={ICON_CLASS_NAME} aria-hidden="true" />;
}

export function MoonIcon() {
  return <DarkModeOutlinedIcon className={ICON_CLASS_NAME} aria-hidden="true" />;
}

export function GearIcon() {
  return <SettingsOutlinedIcon className={ICON_CLASS_NAME} aria-hidden="true" />;
}
