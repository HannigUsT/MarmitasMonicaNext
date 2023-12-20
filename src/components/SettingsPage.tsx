/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import axios from "axios";
import { FC, useEffect, useState } from "react";
import { UserFormData } from "@/lib/validators/user";
import { ToggleButtonProps, UserSession } from "@/types/@types";
import PrivacyPolicy from "@/components/PrivacyPolicy";
import UserAuthForm from "@/components/UserAuthForm";
import PartnerAuthForm from "@/components/PartnerAuthForm";

const ToggleButton: FC<ToggleButtonProps> = ({
  onClick,
  disabled,
  children,
}) => (
  <button
    className={`py-2 px-4 rounded-md flex items-center justify-center ${
      disabled ? "bg-gray-400 text-black" : "bg-gray-900 text-white"
    }`}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

const SettingsPage = ({ ...session }) => {
  const [thisUserData, setThisUserData] = useState<UserFormData | undefined>();
  const [loading, setLoading] = useState(true);
  const [firstTime, setFirstTime] = useState(false);
  const [showUserForm, setShowUserForm] = useState(true);
  const [showPartnerForm, setShowPartnerForm] = useState(false);

  const ToggleUserFormButton: FC<{ onClick: () => void }> = ({ onClick }) => (
    <ToggleButton onClick={onClick} disabled={showPartnerForm}>
      Atualizar Dados de Cliente.
    </ToggleButton>
  );

  const TogglePartnerFormButton: FC<{ onClick: () => void }> = ({
    onClick,
  }) => (
    <ToggleButton onClick={onClick} disabled={showUserForm}>
      Deseja virar Parceiro?
    </ToggleButton>
  );

  useEffect(() => {
    try {
      (async () => {
        if (session.user.privacyPolicy === 0) {
          setLoading(false);
          setFirstTime(true);
        } else if (session.user.privacyPolicy === 1) {
          setLoading(true);
          const userResponse = await axios.get(`/api/user`);
          if (userResponse.data.cpf !== null) {
            setThisUserData(userResponse.data);
          }
          setLoading(true);
          const payload: UserSession = {
            privacyPolicy: 1,
          };
          const { data } = await axios.patch("/api/session", payload);
          if (data === "OK") {
            const privacyDiv = document.getElementById("privacy");
            const buttonDiv = document.getElementById("button");
            const authForm = document.getElementById("auth-form");
            if (privacyDiv && buttonDiv && authForm) {
              privacyDiv.style.display = "none";
              buttonDiv.style.display = "none";
              authForm.style.display = "contents";
            }
            setLoading(false);
          }
        }
      })();
    } catch (error) {
      setLoading(false);
    }
  }, []);

  const hidePrivacyPolicy = () => {
    sessionStorage.setItem("privacyPolicy", "true");
    if (firstTime) {
      const firstForm = document.getElementById("first-form");
      const privacyDiv = document.getElementById("privacy");
      const buttonDiv = document.getElementById("button");
      if (privacyDiv && buttonDiv && firstForm) {
        privacyDiv.style.display = "none";
        buttonDiv.style.display = "none";
        firstForm.style.display = "contents";
      }
    } else {
      const privacyDiv = document.getElementById("privacy");
      const buttonDiv = document.getElementById("button");
      if (privacyDiv && buttonDiv) {
        privacyDiv.style.display = "none";
        buttonDiv.style.display = "none";
        const authForm = document.getElementById("auth-form");
        if (authForm) authForm.style.display = "contents";
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex items-center justify-center">
      {loading && (
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-blue-500"></div>
      )}
      <div
        className="h-full mx-auto flex flex-col items-center justify-center gap-2"
        style={{ display: loading ? "none" : "block" }}
      >
        <div id="privacy">
          <PrivacyPolicy />
        </div>

        <div id="button">
          <div className="flex p-2 border items-center justify-center mb-2 underline underline-offset-2 text-center">
            <input
              type="checkbox"
              name="privacy-policy"
              className="w-8 h-8"
              onClick={hidePrivacyPolicy}
            />
            Concordo com os termos e condições
          </div>
        </div>
        <div className="h-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-12">
          {firstTime === true &&
            session.user !== undefined &&
            session.user.privacyPolicy === 0 && (
              <div id="first-form" style={{ display: "none" }}>
                <UserAuthForm
                  userData={{
                    pessoa: {
                      nome: "",
                      dataNascimento: new Date(),
                      contato: "",
                      cpf: "",
                    },
                    endereco: {
                      cep: "",
                      logradouro: "",
                      bairro: "",
                      localidade: "",
                      uf: "",
                      complemento: "",
                      casa: "",
                    },
                  }}
                />
              </div>
            )}

          {thisUserData !== undefined && (
            <>
              <div className="h-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-12">
                <div id="button">
                  <ToggleUserFormButton
                    onClick={() => setShowUserForm(!showUserForm)}
                  />
                </div>
                <div
                  id="auth-form"
                  style={{ display: showUserForm ? "block" : "none" }}
                >
                  <UserAuthForm userData={thisUserData} />
                </div>
                <div id="button">
                  <TogglePartnerFormButton
                    onClick={() => setShowPartnerForm(!showPartnerForm)}
                  />
                </div>
                {session.user !== undefined &&
                  session.user.privacyPolicy === 1 && (
                    <PartnerAuthForm
                      style={{ display: showPartnerForm ? "block" : "none" }}
                    />
                  )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
