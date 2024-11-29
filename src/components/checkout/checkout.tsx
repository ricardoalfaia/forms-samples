"use client";

import React, { useState, useEffect } from "react";
import * as Yup from "yup";

interface Address {
  city?: string;
  country?: string;
}

const emptyAddress: Address = {
  city: "",
  country: "",
};

const STATUS = {
  IDLE: "IDLE",
  SUBMITTED: "SUBMITTED",
  SUBMITTING: "SUBMITTING",
  COMPLETED: "COMPLETED",
};

export function CheckoutForm() {
  const [address, setAddress] = useState<Address>(emptyAddress);
  const [status, setStatus] = useState(STATUS.IDLE);
  // const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveError, setSaveError] = useState<string | unknown>(null);
  const [touched, setTouched] = useState<Address>({});

  // const addressSchema = Yup.object({
  //   street: Yup.string().required("Street is required"),
  //   country: Yup.string().required("City is required"),
  // }).required();

  const errors = getErrors(address);
  const isValid = Object.keys(errors).length === 0;

  useEffect(() => {
    if (status === STATUS.COMPLETED) {
      setAddress(emptyAddress);
      setStatus(STATUS.IDLE);
    }
  }, [status]);

  function getErrors(address: Address) {
    const result: Address = {};
    if (!address.city) result.city = "* City is required";
    if (!address.country) result.country = "* Country is required";
    return result;
  }

  // const validateAddress = async () => {
  //   try {
  //     await addressSchema.validate(address, { abortEarly: false });
  //     setErrors({});
  //     console.log("Validation successful");
  //   } catch (err) {
  //     if (err instanceof Yup.ValidationError) {
  //       const validationErrors: Record<string, string> = {};
  //       err.inner.forEach((error) => {
  //         if (error.path) {
  //           validationErrors[error.path] = error.message;
  //         }
  //       });
  //       setErrors(validationErrors);
  //     }
  //   }
  // };
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setAddress((curAddress) => {
      return {
        ...curAddress,
        [e.target.id]: e.target.value,
      };
    });
  }

  function handleBlur(
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setTouched((cur) => {
      return { ...cur, [e.target.id]: true };
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus(STATUS.SUBMITTING);
    // validateAddress();

    if (isValid) {
      try {
        setTimeout(() => setStatus(STATUS.COMPLETED), 1000);
      } catch (error) {
        if (error instanceof Error) {
          setSaveError(error.message);
        }
      }
    } else {
      setStatus(STATUS.SUBMITTED);
    }
  }

  return (
    <>
      <h1 className="text-center text-3xl mt-8">Shipping Info</h1>

      {!isValid && status === STATUS.SUBMITTED && (
        <div role="alert" className="text-center mt-4 text-red-600">
          <p>Please fix the following errors: </p>
          <ul>
            {Object.keys(errors).map((key: string) => {
              return <li key={key}>{errors[key as keyof typeof address]}</li>;
            })}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="flex justify-center mt-2 flex-col items-center">
          <div>
            <label
              className="text-black font-bold text-lg text-left"
              htmlFor="city"
            >
              City
            </label>
            <br />
            <input
              className="border-solid border-2 border-gray-400 w-[450px] h-10 mt-2 mb-2 p-2"
              id="city"
              name="city"
              type="text"
              value={address.city}
              onBlur={handleBlur}
              onChange={handleChange}
              placeholder="enter the city"
            />
            <p className="text-red-600">
              {(touched.city || status === STATUS.SUBMITTED) && errors.city}
            </p>
          </div>
          <div className="flex flex-col mt-2">
            <label className="text-lg font-bold mb-2" htmlFor="country">
              Country
            </label>
            <select
              className="border-2 border-gray-400 border-solid h-10 w-[450px] mb-2 p-2"
              name="country"
              id="country"
              value={address.country}
              onBlur={handleBlur}
              onChange={handleChange}
            >
              <option value="">Select country</option>
              <option value="Brasil">Brasil</option>
              <option value="China">China</option>
              <option value="Espanha">Espanha</option>
              <option value="USA">USA</option>
            </select>
            <p className="text-red-600">
              {(touched.country || status === STATUS.SUBMITTED) &&
                errors.country}
            </p>
          </div>
          <div>
            <input
              className="bg-lime-700 text-white p-3 mt-4 rounded-lg font-bold"
              type="submit"
              value="Save Shipping Info"
              disabled={status === STATUS.SUBMITTING}
            />
          </div>
        </div>
      </form>
    </>
  );
}

//TODO: testar uma forma de trabalhar com estados finitos utilizando XState
// import { createMachine, interpret, assign } from 'xstate';
// import * as yup from 'yup';

// // Definindo o esquema de validação com Yup
// const formSchema = yup.object().shape({
//   nome: yup.string().required('O nome é obrigatório'),
//   email: yup.string().email('Email inválido').required('O email é obrigatório')
// });

// // Definindo o contexto da máquina de estados
// interface FormContext {
//   data: {
//     nome: string;
//     email: string;
//   };
//   error: string | null;
// }

// // Definindo os eventos que a máquina pode receber
// type FormEvent =
//   | { type: 'START' }
//   | { type: 'CHANGE'; data: Partial<FormContext['data']> }
//   | { type: 'SUBMIT' };

// // Criando a máquina de estados
// const formMachine = createMachine<FormContext, FormEvent>({
//   id: 'form',
//   initial: 'idle',
//   context: {
//     data: { nome: '', email: '' },
//     error: null
//   },
//   states: {
//     idle: {
//       on: {
//         START: 'filling'
//       }
//     },
//     filling: {
//       on: {
//         CHANGE: {
//           actions: 'updateData'
//         },
//         SUBMIT: 'validating'
//       }
//     },
//     validating: {
//       invoke: {
//         src: 'validateData',
//         onDone: {
//           target: 'submitted',
//           actions: 'clearError'
//         },
//         onError: {
//           target: 'filling',
//           actions: 'setError'
//         }
//       }
//     },
//     submitted: {
//       type: 'final'
//     }
//   }
// }, {
//   actions: {
//     updateData: assign((context, event) => ({
//       data: { ...context.data, ...event.data }
//     })),
//     setError: assign((context, event) => ({
//       error: event.data
//     })),
//     clearError: assign((context) => ({
//       error: null
//     }))
//   },
//   services: {
//     validateData: (context) => {
//       return formSchema.validate(context.data, { abortEarly: false })
//         .then(() => Promise.resolve())
//         .catch((err) => Promise.reject(err.errors));
//     }
//   }
// });

// // Interpretando a máquina de estados
// const formService = interpret(formMachine)
//   .onTransition((state) => console.log(state.value, state.context))
//   .start();

// // Enviar eventos para mudar o estado
// formService.send({ type: 'START' });
// formService.send({ type: 'CHANGE', data: { nome: 'João' } });
// formService.send({ type: 'CHANGE', data: { email: 'joao@example.com' } });
// formService.send({ type: 'SUBMIT' });
