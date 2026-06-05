import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import * as Tabs from "@radix-ui/react-tabs";
import { useAppDispatch, useAppSelector } from "../../hooks/store";
// import { usePositionAction } from "../../features/position/usePositionAction";
import { useCallback, useEffect, useState } from "react";

import { PlantStatus } from "../../constants/PlantStatus";
//import { RootState } from "../../features";
import { DocumentType } from "../../constants/DocumentType";
import { CharacterPlant } from "../../constants/CharacterPlant";
//import { PlantPosition } from './PlantPosition';

import {
  useForm,
  FormProvider,
  useFormContext,
  FieldErrors,
  Controller,
} from "react-hook-form";

import { PositionDto } from "../../models/position";
import { PlantPositionRequest } from "../../models/plant-position";
//
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { Select } from "../../components/ui/Select";
import { TextArea } from "../../components/ui/TextArea";
import { Button } from "../../components/ui/Button";

import { addPlantPosition } from "../../features/plant/plantPositionThunk";
// import { fetchAgentByDocument } from "../../features/agent/agentThunk";
import { fetchAvailablePositions } from "../../features/position/positionThunk";
import AgentAutocomplete from "../../components/ui/AgentAutocomplete";
import { RootState } from "../../features";
import { fetchSuborganizationalUnits } from "../../features/suborganizational/suborganizationalThunk";
import { FaSave } from "react-icons/fa";

// Schema for validation (uncomment resolver in useForm to use it)
const formSchema = z.object({
  agent: z.object({
    id: z.number().min(1, "Debe seleccionar un agente"),
    firstname: z.string(),
    lastname: z.string(),
    address: z.string().optional(),
    email: z.string().optional(),
    documenttype: z.enum(["DNI", "PASAPORTE", "CE", "CI", "LE"]),
    document: z.string(),

    // Puedes descomentar estos campos si los necesitas más adelante
    // birthdate: z.string(),
    // file: z.string(),
    // email: z.string(),
    // phone: z.string(),
  }),
  position: z.object({
    id: z.number().min(1, "Debe seleccionar un cargo"),
    namePosition: z.string(),
    nameUnit: z.string(),
    pointsAvailable: z.number(),
    //   positionStatus: z.nativeEnum( StatusOfPosition),
    positionStatus: z.enum([
      "ACTIVO",
      "VACANTE_DEFINITIVA",
      "VACANTE_TRANSITORIA",
      "SUPRIMIDO",
    ]),
  }),
  organizationalSubUnit: z.coerce.number().min(1, "Seleccione una materia"),
  reasonForMovement: z.string().min(10, "El motivo es poco claro"),
  // characterPlant: z.nativeEnum(CharacterPlant),
  // currentStatus: z.nativeEnum(PlantStatus),
  characterPlant: z.enum(["ORDINARIO", "INTERINO", "CONTRATADO"]),
  currentStatus: z.enum([
    "ACTIVO",
    "LICENCIA_TRANSITORIA",
    "OCUPADO_TRANSITORIAMENTE",
    "FINALIZADO",
  ]),
  dateFrom: z.string().date("Fecha invalida"),
  dateTo: z.string().optional(),
});
type FormData = z.infer<typeof formSchema>;

const defaultValues: FormData = {
  agent: {
    id: 0,
    firstname: "",
    lastname: "",
    address: "",
    email: "",
    documenttype: "DNI",
    document: "",
  },
  position: {
    id: 0,
    namePosition: "",
    nameUnit: "",
    pointsAvailable: 0,
    positionStatus: "ACTIVO",
  },
  organizationalSubUnit: 0,
  reasonForMovement: "",
  characterPlant: "ORDINARIO",
  currentStatus: "ACTIVO",
  dateFrom: new Date().toISOString().split("T")[0],
  dateTo: "", //new Date().toISOString().split("T")[0],
};

export const PlantPositionCreate = () => {
  const [activeTab, setActiveTab] = useState("tab1");

  const methods = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // const {} = usePla;
  const dispatch = useAppDispatch();
  //const { addPlantPosition } = usePlantPositionAction();

  const { handleSubmit } = methods;

  const onSubmit = (data: FormData) => {
    console.log("Formulario completo", data);
    const plantPosition: PlantPositionRequest = {
      id: 0,
      positionId: data.position.id,
      agentId: data.agent.id, // Este valor debe ser asignado según tu lógica de negocio
      organizationalSubUnit: data.organizationalSubUnit,
      characterplantID: data.characterPlant as CharacterPlant, // Asignar un ID basado en el índice
      currentStatusID: data.currentStatus as PlantStatus, // Asignar un ID basado en el estado
      dateFrom: data.dateFrom,
      dateTo: data.dateTo ?? "",
      reasonForMovement: data.reasonForMovement,
    };
    console.log("Datos del formulario para enviar:", plantPosition);
    dispatch(addPlantPosition(plantPosition));
  };

  const onError = (errors: FieldErrors<FormData>) => {
    console.error("Errores en el formulario", errors);

    if (errors.agent) {
      setActiveTab("tab1");
    } else if (errors.position) {
      setActiveTab("tab2");
    } else if (
      errors.reasonForMovement ||
      errors.characterPlant ||
      errors.currentStatus ||
      errors.dateFrom ||
      errors.dateTo ||
      errors.organizationalSubUnit
    ) {
      setActiveTab("tab3");
    }
  };

  return (
    <div>
      <h5 className="p-2 mb-6 text-1xl font-bold text-gray-400 dark:text-white border border-gray-200 bg-[#cddafd] rounded-t-lg">
        Planta de cargos
      </h5>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <Tabs.Root
            value={activeTab}
            onValueChange={setActiveTab}
            className="mb-4"
          >
            <Tabs.TabsList className="flex space-x-5">
              <Tabs.Trigger
                value="tab1"
                className="py-2 px-4 rounded-md border border-gray-300 focus:outline outline-offset-2 outline-pink-500"
              >
                Datos Personales
              </Tabs.Trigger>
              <Tabs.Trigger
                value="tab2"
                className="py-2 px-4 rounded-md border border-gray-300 focus:outline outline-offset-2 outline-pink-500"
              >
                Información de Cargo
              </Tabs.Trigger>
              <Tabs.Trigger
                value="tab3"
                className="py-2 px-4 rounded-md border border-gray-300 focus:outline outline-offset-2 outline-pink-500"
              >
                Información de Planta
              </Tabs.Trigger>
            </Tabs.TabsList>

            <Tabs.Content value="tab1" className="pt-4 h-[400px]">
              <PersonalDataTab />
            </Tabs.Content>
            <Tabs.Content value="tab2" className="pt-4 h-[400px]">
              <PositionTab />
            </Tabs.Content>
            <Tabs.Content value="tab3" className="pt-4 h-[400px]">
              <PlantDataTab />
            </Tabs.Content>
          </Tabs.Root>
          <Button
            type="submit"
            className="text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200 font-medium rounded-lg inline-flex text-sm px-5 py-2.5 items-center gap-2"
          >
            Agregar <FaSave />
          </Button>
        </form>
      </FormProvider>
    </div>
  );
};

const PersonalDataTab = () => {
  // register, setValue,
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<FormData>();
  // const document = watch('document');
  const agent = watch("agent");
  //const { agent } = useAppSelector((state: RootState) => state.agents);

  // const dispatch = useAppDispatch();

  /*  const searchByDocument = async () => {
 
         const result = await dispatch(fetchAgentByDocument(document)).unwrap();
         /// console.log("Buscando agente por documento:", );
         setValue("agent.id", result.id ?? 0);
         setValue("agent.firstname", result.firstname ?? "");
         setValue("agent.lastname", result.lastname ?? "");
         setValue("agent.document", result.document ?? "")
 
         console.log("AGENTE PERSONAL ", JSON.stringify(agent));
     } */

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 m-4 mb-10">
        <Controller
          name="agent"
          control={control}
          render={({ field: { onChange } }) => (
            <div className="flex-1">
              <AgentAutocomplete onSelect={(a) => onChange(a)} />
            </div>
          )}
        />

        {errors.agent?.id && (
          <p className="text-red-500 text-sm mt-1">{errors.agent.id.message}</p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 m-4">
        <div>
          <Label htmlFor="firstname">Nombre: </Label>
          <Input value={agent?.firstname} readOnly disabled/>
        </div>

        <div>
          <Label htmlFor="lastname">Apellido: </Label>
          <Input value={agent?.lastname} readOnly  disabled/>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 m-4">
        <div>
          <Label htmlFor="documenttype">Tipo Doc. </Label>
          <Select value={agent?.documenttype} disabled>
            {DocumentType.map((doctype, key) => (
              <option key={key} value={doctype}>
                {doctype}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="document">Documento: </Label>
          <Input value={agent?.document} readOnly disabled />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 m-4">
        <div>
          <Label htmlFor="address">Domicilio: </Label>
          <Input value={agent?.address} readOnly disabled />
        </div>

        <div>
          <Label htmlFor="email">Correo Electronico </Label>
          <Input value={agent?.email} readOnly disabled/>
        </div>
      </div>
    </div>
  );
};

const PositionTab = () => {
  const dispatch = useAppDispatch();
  const { positions, loading } = useAppSelector((state) => state.positions);

  //const [selectedItem, setSelectedItem] = useState<PositionDto | null>(null);

  const {
    watch,
    register,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext<FormData>();

  const selectedPosition = watch("position");
  const selectedItemId = selectedPosition?.id;

  useEffect(() => {
    dispatch(fetchAvailablePositions());
  }, []);

  useEffect(() => {
    if (selectedItemId && selectedItemId > 0) {
      clearErrors("position.id");
    }
  }, [selectedItemId, clearErrors]);

  const handleSelectedItem = useCallback(
    (item: PositionDto) => {
      setValue("position", {
        id: item.id,
        namePosition: item.namePosition,
        nameUnit: item.nameUnit ?? "",
        pointsAvailable: item.pointsAvailable,
        // Cast to the string union expected by the form schema
        positionStatus: item.positionStatus as unknown as
          | "ACTIVO"
          | "VACANTE_DEFINITIVA"
          | "VACANTE_TRANSITORIA"
          | "SUPRIMIDO",
      });
      console.log("Cargo seleccionado:", item);
    },
    [setValue]
  );

  /*   const handleSelectedItem = (item: PositionDto) => {

        setValue("position.id", item.id);
        setValue("position.namePosition", item.namePosition);
        setValue("position.nameUnit", item.nameUnit ?? "");
        setValue("position.pointsAvailable", item.pointsAvailable);
        setValue("position.positionStatus", item.positionStatus as unknown as "ACTIVO" | "VACANTE_DEFINITIVA" | "VACANTE_TRANSITORIA" | "SUPRIMIDO");
        console.log("Cargo seleccionado:", item);
    } */

  /*  const handleUnselectItem = () => {

        setValue("position.id", 0);
        setValue("position.namePosition", "");
        setValue("position.nameUnit", "");
        setValue("position.pointsAvailable", 0);
        setValue("position.positionStatus", "ACTIVO");
    } */

  const handleUnselectItem = () => {
    setValue("position", defaultValues.position);
  };

  const selectedItem =
    positions.find((p) => p.id === Number(selectedItemId)) || null;

  console.log("ITEM SELECCIONADO EN TAB CARGO ", selectedItem);

  return (
    <div className="container max-w-6xl mx-auto px-4 py-6">
      <table className="min-w-full table-fixed border-collapse">
        <thead className="bg-gray-200 sticky top-0 z-10">
          <tr>
            <th className="p-3 text-center">Id Cargo</th>
            <th className="p-3 text-center">Nombre Cargo</th>
            <th className="p-3 text-center">Estado Cargo</th>
            <th className="p-3 text-center">Cantidad Puntos</th>
            <th className="p-3 text-center">Seleccionar</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={3} className="text-center text-gray-500">
                Cargando...
              </td>
            </tr>
          ) : (
            positions.map((position) => {
              return (
                <tr key={position.id}>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {position.id}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white break-words max-w-xs">
                    {position.namePosition.toLowerCase()}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {position.positionStatus.toLowerCase()}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {Math.floor(
                      (position.pointsAvailable * position.amountPoint) / 100
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    <input
                      type="radio"
                      name="selected"
                      checked={selectedItem?.id === position.id}
                      onChange={() => handleSelectedItem(position)}
                    />
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      <input
        type="hidden"
        {...register("position.id", { valueAsNumber: true })}
      />
      {errors.position?.id && (
        <p className="text-red-500 text-sm mt-1">
          {errors.position.id.message}
        </p>
      )}

      <h2 className="p-2 mb-0 text-1xl font-bold  text-gray-900 dark:text-white border border-gray-200 bg-gray-100">
        Cargo Seleccionado
      </h2>

      <table className="min-w-full table-auto border border-gray-300 rounded-lg shadow">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 text-center">Id Cargo</th>
            <th className="px-6 py-4 font-medium text-gray-900 dark:text-white break-words max-w-xs">
              Nombre Cargo
            </th>
            <th className="p-3 text-center">Estado Cargo</th>
            <th className="p-3 text-center">Cantidad Puntos</th>
            <th className="p-3 text-center">Acción</th>
          </tr>
        </thead>
        <tbody>
          {selectedItem ? (
            <tr key={selectedItem.id}>
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {selectedItem.id}
              </td>
              <td className="px-6 py-4 font-medium text-gray-900 dark:text-white break-words max-w-xs">
                {selectedItem.namePosition.toLowerCase()}
              </td>
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {selectedItem.positionStatus}
              </td>
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {Math.floor(
                  (selectedItem.pointsAvailable * selectedItem.amountPoint) /
                    100
                )}
              </td>
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                <button onClick={() => handleUnselectItem()}>Eliminar</button>
              </td>
            </tr>
          ) : (
            <tr>
              <td colSpan={3} className="text-center text-gray-500">
                No hay elementos en la tabla destino.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const PlantDataTab = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormData>();
  //const { errors } = formState;

  const dispatch = useAppDispatch();
  const { suborganizationalDTOs } = useAppSelector(
    (state: RootState) => state.suborganizationals
  );

  useEffect(() => {
    dispatch(fetchSuborganizationalUnits());
  }, []);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-3 m-4">
        <div>
          <Label htmlFor="characterPlant">Caract. Planta</Label>
          <Select {...register("characterPlant")}>
              <option value="">Seleccionar</option>
            {Object.entries(CharacterPlant).map(([key, charac]) => (
              <option key={key} value={key}>
                {charac}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="currentStatus">Estado Actual</Label>
          <Select {...register("currentStatus")}>
            <option value="">Seleccionar</option>
            {Object.entries(PlantStatus).map(([key, status]) => (
              <option key={key} value={key}>
                {status}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="">Departamento</Label>
          <Select
            {...register("organizationalSubUnit", { valueAsNumber: true })}
          >
            <option value="">Seleccionar</option>
            {suborganizationalDTOs.map((suborg) => (
              <option key={suborg.id} value={suborg.id}>
                {suborg.nameSubUnit}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 m-4">
        <div>
          <Label htmlFor="dateFrom">Fecha Desde</Label>
          <Input type="date" {...register("dateFrom")} />
          {errors.dateFrom && (
            <p className="text-red-500">Debe ingresar una fecha valida</p>
          )}
        </div>
        <div>
          <Label htmlFor="dateTo">Fecha Hasta</Label>
          <Input type="date" {...register("dateTo")} />
        </div>
      </div>

      <div className="m-4">
        <Label htmlFor="reasonForMovement">Razón de Movimiento</Label>
        <TextArea {...register("reasonForMovement")} />
        {errors.reasonForMovement && (
          <p className="text-red-500">Debe ingresar una razón valida</p>
        )}
      </div>
    </div>
  );
};

/* const FormSchema = z.object({

    document: z.string().min(7, "DNI invalido"),
    agent: z.object({

        firstname: z.string().optional(),
        lastname: z.string().optional(),
        documenttype: z.enum(["DNI", "PASAPORTE", "CE", "CI", "LE"]).optional(),
        document: z.string().optional(),
        birthdate: z.string(),
        file: z.string(),
        email: z.string(),
        phone: z.string()
    }),
    position: z.object({
        id: z.number(),
        namePosition: z.string(),
        nameUnit: z.string(),
        pointsAvailable: z.number(),
        positionStatus: z.enum(['ACTIVO', 'VACANTE_DEFINITIVA', 'VACANTE_TRANSITORIA', 'SUPRIMIDO',]),
        discountedQuantity: z.number()
    }),
    reasonForMovement: z.string().min(10, "El motivo es poco claro"),
    characterPlant: z.enum(['ORDINARIO', 'INTERINO', 'CONTRATADO']),
    dateFrom: z.string().refine((arg) =>
        arg.match(
            /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)((-(\d{2}):(\d{2})|Z)?)$/
        )),
    dateTo: z.string().refine((arg) =>
        arg.match(
            /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)((-(\d{2}):(\d{2})|Z)?)$/
        )),

}); */
