import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import App from "../App";
afterEach(cleanup);
describe("Socle conservé de la séance 2", () => {
  it("ouvre une modale nommée et focalise son titre", () => {
    render(<App />); fireEvent.click(screen.getByRole("button", {name:"Réserver Orbite 9"}));
    expect(screen.getByRole("heading", {name:"Réserver Orbite 9"})).toHaveFocus();
  });
  it("ferme et revient au film choisi", () => {
    render(<App />); const opener=screen.getByRole("button", {name:"Réserver Orbite 9"}); fireEvent.click(opener);
    fireEvent.click(screen.getByRole("button", {name:"Revenir aux films"})); expect(opener).toHaveFocus();
  });
  it("envoyer vide, vérifier aria-invalid et la description du champ email.", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Réserver Orbite 9" }));
    fireEvent.click(screen.getByRole("button", { name: "Confirmer la réservation" }));
    const email = screen.getByRole("textbox", { name: /adresse électronique/i });
    expect(email).toHaveAttribute("aria-invalid", "true");
    expect(email).toHaveAccessibleDescription(/Format attendu.*Saisissez une adresse électronique/);
  });
  it("vérifier que le résumé d'erreurs reçoit le focus.", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Réserver Orbite 9" }));
    fireEvent.click(screen.getByRole("button", { name: "Confirmer la réservation" }));
    expect(screen.getByRole("group", { name: /contient des erreurs/ })).toHaveFocus();
  });
});
