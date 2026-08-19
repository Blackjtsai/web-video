import "./styles/fonts.css";
import "./styles/tokens.css";
import "./styles/base.css";
import { MobilePage } from "./components/MobilePage";

export default function App() {
  return <MobilePage baseUrl={import.meta.env.BASE_URL} />;
}
