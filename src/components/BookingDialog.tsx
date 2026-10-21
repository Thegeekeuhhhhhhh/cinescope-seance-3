import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import type { Film } from "../films";
import { readReservation, type Errors, type Reservation } from "../reservation";

type BookingDialogProps = {
  film: Film;
  onConfirm: (film: Film, reservation: Reservation) => void;
  onClose: () => void;
};

export default function BookingDialog({
  film,
  onConfirm,
  onClose,
}: BookingDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const confirmedRef = useRef(false);
  const prefix = useId();
  const id = (part: string) => `${prefix}-${part}`;
  const [errors, setErrors] = useState<Errors>({});

  const summaryRef = useRef<HTMLDivElement>(null);
  const errorList = Object.entries(errors) as [keyof Errors, string][];
  const target = function (f: keyof Errors) {
    return f == "tariff" ? id("tariff-standard") : id(f);
  }
  const describedBy = function (f: keyof Errors) {
    return id(f + "-help") + (errors[f] ? " " + id(f + "-error") : "");
  }

  useEffect(() => {
    if (errorList.length > 0) {
      summaryRef.current?.focus();
    }
  }, [errors]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    confirmedRef.current = false;
    if (!dialog.open) dialog.showModal();
    titleRef.current?.focus();
  }, [film.id]);

  const closeBooking = () => dialogRef.current?.close();
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!film.available || confirmedRef.current) return;
    const result = readReservation(event.currentTarget);
    setErrors(result.errors);
    if (Object.keys(result.errors).length > 0) return;
    confirmedRef.current = true;
    onConfirm(film, result.values);
    closeBooking();
  };

  return (
    <dialog ref={dialogRef} aria-labelledby={id("title")} onClose={onClose}>
      <div className="dialog-heading">
        <h2 id={id("title")} ref={titleRef} tabIndex={-1}>
          Réserver {film.title}
        </h2>
        <button
          type="button"
          className="close"
          aria-label="Fermer la réservation"
          onClick={closeBooking}
        >
          ×
        </button>
      </div>
      <p>
        {film.genre} · Séance de {film.time}
      </p>
      <p
        className={
          "availability " + (film.available ? "available" : "unavailable")
        }
      >
        {film.available ? "Places disponibles" : "Séance complète"}
      </p>
      {film.available ? (
        <>
          <p>
            Une place par réservation. Tous les champs du formulaire sont
            obligatoires.
          </p>
          {errorList.length > 0 && (
            <div className="error-summary" ref={summaryRef} tabIndex={-1}
              role="group" aria-labelledby={id("summary-title")}>
              <h3 id={id("summary-title")}>Le formulaire contient des erreurs</h3>
              <ul>
                {errorList.map(([f, msg]) => (
                  <li key={f}><a href={"#" + target(f)}>{msg}</a></li>
                ))}
              </ul>
            </div>
          )}
          {Object.keys(errors).length > 0 && (
            <p className="field-error">Certains champs sont incorrects.</p>
          )}
          <form noValidate onSubmit={submit}>
            <fieldset className="form-group" aria-describedby={describedBy("tariff")}>
              <legend>Type de place</legend>
              <p className="field-help" id={id("tariff-help")}>
                Choisissez un type de place pour ce billet.
              </p>
              {errors.tariff && <p className="field-error" id={id("tariff-error")}>{errors.tariff}</p>}
              <div className="radio-options">
                <span>
                  <input
                    id={id("tariff-standard")}
                    name="tariff"
                    type="radio"
                    value="standard"
                  />
                  <label htmlFor={id("tariff-standard")}>Standard</label>
                </span>
                <span>
                  <input
                    id={id("tariff-student")}
                    name="tariff"
                    type="radio"
                    value="student"
                  />
                  <label htmlFor={id("tariff-student")}>Étudiant</label>
                </span>
              </div>
            </fieldset>
            <div className="field">
              <label htmlFor={id("name")} className="field-label">
                Nom de réservation
              </label>
              <p className="field-help" id={id("name-help")}>
                Indiquez le nom de la personne qui réserve.
              </p>
              {errors.name && <p className="field-error" id={id("name-error")}>{errors.name}</p>}
              <input
                id={id("name")}
                name="name"
                aria-invalid={errors.name ? "true" : undefined}
                aria-describedby={describedBy("name")}
                placeholder="Votre nom"
                className={errors.name ? "invalid" : undefined}
              />
            </div>
            <div className="field">
              <label htmlFor={id("email")} className="field-label">
                Adresse électronique
              </label>
              <p className="field-help" id={id("email-help")}>
                Format attendu : nom@exemple.fr.
              </p>
              {errors.email && <p className="field-error" id={id("email-error")}>{errors.email}</p>}
              <input
                id={id("email")}
                name="email"
                type="email"
                aria-invalid={errors.email ? "true" : undefined}
                aria-describedby={describedBy("email")}
                placeholder="Votre adresse"
                className={errors.email ? "invalid" : undefined}
              />
            </div>
            <div className="dialog-actions">
              <button className="dialog-action" type="submit">
                Confirmer la réservation
              </button>
              <button
                className="dialog-action dialog-secondary"
                type="button"
                onClick={closeBooking}
              >
                Revenir aux films
              </button>
            </div>
          </form>
        </>
      ) : (
        <>
          <p>
            Cette séance est complète : aucune réservation ne peut être
            confirmée.
          </p>
          <button
            className="dialog-action"
            type="button"
            onClick={closeBooking}
          >
            Revenir aux films
          </button>
        </>
      )}
    </dialog>
  );
}
