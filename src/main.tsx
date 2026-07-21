import { render } from "preact";
import { App } from "./App";
import { LanguageProvider } from "./i18n/LanguageContext";
import "./styles/global.css";

const root = document.getElementById("app");
if (!root) throw new Error("Missing #app root element");

render(
  <LanguageProvider>
    <App />
  </LanguageProvider>,
  root,
);
