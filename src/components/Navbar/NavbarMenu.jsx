//#region -----------------------------------------------------------------------IMPORTS
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import "./Navbar.css";
// ------------------------ OBJECTS ------------------------
import { objectParentescos, objectCategorias, inputsNumCategorias, objectConvenios, inputsNumConvenios, inputNumDataValores, tableValoresHeadings, inputNumDataEscala, inputDateDataEscala, inputNumDataDeducciones, inputDateDataDeducciones, objectBancos, objectEmpresasTelefonia, objectSindicatos, objectTareas, objectEstadosCiviles, objectEstudios, objectTipoDocumento, objectEstado, objectFormasDePago, objectMotivosEgreso, objectCalles, objectPaises, objectModosLiquidacion, objectModosContratacion, objectCargos, objectObrasSociales, objectAFJP, objectCentrosCosto, objectSectoresDptos, objectDirecciones, objectLugaresPago, objectDocumentacion, tableReduccionHeadings, tableConvenios, tableJerarquia, tableLicencias, inputsNumLicencias, objectAlicuotas, checkboxParentescos, checkboxNumParentescos, textAreaObject, textAreaCargos,urls, objectProvincias, objectEmpleadores } from './Objects'
// -----------------------------------------------------------

import { AXIOS_ERROR, SET_LOADING } from '../../redux/types/fetchTypes';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { addEstadosCiviles, addEstados, addPaises, addEstudios, addTiposDocumento, addCargos, addTareasDesempeñadas, addParentescos, addFormasPago, addModosContratacion, addModosLiquidacion, addEmpleadores, addDomicilios, addCalles, addDepartamentos, addBarrios, addProvincias, addLocalidades, addNewEstadoCivil, addNewEstudio, getIdEstadoCivil, deleteEstadoCivil, getIdEstudio, deleteEstudio, addNewTipoDoc, deleteTipoDoc, getIdTipoDoc, putEstadoCivil, putEstudio, putTipoDoc, addNewParentesco, deleteParentesco, putParentesco, getIdParentesco, addNewEstado, deleteEstado, putEstado, getIdEstado, addNewFormaPago, deleteFormaPago, putFormaPago, getIdFormaPago, addNewCargo, deleteCargo, putCargo, getIdCargo, addNewTarea, deleteTarea, putTarea, getIdTarea, actualizaDelete, actualizaDeleteFormasdePago, actualizaModificarESCI, actualizaCreaFormasdePago, actualizaModificarFormasdePago } from '../../redux/actions/fetchActions';
import { addSelectedCargo, addSelectedEstado, addSelectedEstadoCivil, addSelectedEstudio, addSelectedFormaPago, addSelectedParentesco, addSelectedTarea, addSelectedTipoDocu, setRefetch } from '../../redux/actions/modalesActions';
import ButtonCallModal from "../ButtonCallModal/ButtonCallModal";
import ChildModal from "../Modals/ChildModal";
import { propsModal, propsModalEstado, propsModalEstudios, propsModalParentesco, propsModalTiposDocumento } from "../Modals/props";
import { useNavigate } from "react-router-dom";

// import { getEstadosCivilesModal } from '../../services/fetchAPI';
// import { useEffect } from 'react';
//#endregion

const NavbarMenu = ({setTokenDef, sePerfilesUSuario, perfilesUsuario}) => {
	const [ modalValues, setModalValues ] = useState({});
	const [ nameModal, setNameModal ] = useState({});
	const [ valueItemModal , setValueItemModal ] = useState({});
    const [ modify, setModify ] = useState(false);
    const [ disableModal, setDisableMOdal ] = useState(true);
	const [ transition, setTransition ] = useState(false);
	const [ disableModalButtons, setDisableModalButtons ] = useState(false);
	const dispatch = useDispatch();
	const refetch = useSelector((state)=> state.modalState.refetch);
	const navigate = useNavigate();

	const handleClickClose=(nameModalProp)=>{
        let newState = {...nameModal}
    
        newState[nameModalProp] = false;
        setNameModal(newState);
        setTransition(true);
    }
	function closeSession(){
		setTokenDef(null);
		sePerfilesUSuario(null);
		return navigate("/");
	}
	async function sendModalData(url, body,bodyUpdate, id){
        if(modify){
            try{
                await axios
                .put(`${url}/${id}`, bodyUpdate)
                .then((res)=>{
                    if(res.status === 200){
                        dispatch(setRefetch(!refetch))
                        setModify(false);
                        setDisableMOdal(true)
						dispatch(actualizaModificarFormasdePago(id))

                        return swal({
                            title : "Ok",
                            text : "Item actualizado con éxito",
                            icon : "success"
                        });
                    }
                    return;
                })
            }catch(err){
                setModify(false);
                setDisableMOdal(true)
                return swal({
                    title : "Error",
                    text : "Error al actualizar el item" + `${err}`,
                    icon : "error"
                });
            }
            return;
        }
        try{
            //debugger;
            await axios
            .post(url, body)
            .then((res)=>{
                if(res.status === 200){
                    dispatch(setRefetch(!refetch))
                    setDisableMOdal(true)
					dispatch(actualizaCreaFormasdePago(body))


                    return swal({
                        title : "Ok",
                        text : "Item guardado con éxito",
                        icon : "success"
                    });
                }
            })
        }catch(err){
            setDisableMOdal(true)
            return swal({
                title : "Error",
                text : "Error al guardar el item" + `${err}`,
                icon : "error"
            });
        }
    }
    async function deleteItemModal(url, id, actionActualizaDelete){
        swal({
              title: "Desea eliminar el item?",
              text: "Si confirma el item será borrado de la Base de Datos",
              icon: "warning",
              buttons: true,
              dangerMode: true,
            })
            .then( async (willDelete) => {
              if (willDelete) {
                    try{
                    await axios
                        .delete(`${url}/${id}`)
                        .then((res)=>{
                            if(res.status === 200){
                                dispatch(setRefetch(!refetch))
								dispatch(actionActualizaDelete(id))

                                setDisableMOdal(true)
                                return swal({
                                    title : "Ok",
                                    text : "Item eliminado con éxito",
                                    icon : "success"
                                });
                            }
                            return;
                        })
                }catch(err){
                    setDisableMOdal(true)
                    return swal({
                        title : "Error",
                        text : "Error al eliminar el item" + `${err}`,
                        icon : "error"
                    });
                }
              } else {
                swal("Puede seguir operando");
              }
            });
        
    }
//#region ----------------------------------- URLS DE LOS MODALES	
	const urlEstadosCiviles = "http://54.243.192.82/api/EstadosCiviles"
	const urlEstudios = "http://54.243.192.82/api/Estudios"
	const urlEstado = "http://54.243.192.82/api/Estados"
	const urlFormasdePago = "http://54.243.192.82/api/FormasdePagos"
	// const urlMotivosdeEgresos = "http://54.243.192.82/api/MotivosdeEgresos"
	const urlTiposDocumento = "http://54.243.192.82/api/TiposDocumento"
	const urlCalles = "http://54.243.192.82/api/Calles"
	const urlCargos = "http://54.243.192.82/api/Cargos"
	const urlTareas = "http://54.243.192.82/api/TareasDesempeñadas";
	const urlModosLiquidacion = "http://54.243.192.82/api/ModosLiquidacion";
	const urlModosContratacion = "http://54.243.192.82/api/ModosContratacion";
	const urlParentescos = "http://54.243.192.82/api/Parentescos"
	const urlPaises = "http://54.243.192.82/api/Paises"
	const urlProvincias = "http://54.243.192.82/api/Provincias"
	const urlEmpleadores = "http://54.243.192.82/api/Empleadores"



//#endregion

	
	// estado para recargar cada vez que se ejecute un post/put/delete
	// ESTADOS QUE GUARDAN EL VALOR DE LOS INPUTS
	const [responses, setResponses] = useState({});
	const [modalDataInputs, setModalDataInputs] = useState(responses["modalDataInputs"])

	function onChangeValues(e, key){
        
        const newResponse = {...modalValues};
        newResponse[key] = e;
        setModalValues({
          ...newResponse
        });
    }
  useEffect(() => {
    setResponses({
      ...responses,
      modalDataInputs,
    });
  }, [modalDataInputs]);
	


//#region ----------------------------------- ESTADOS DECLARADOS de Lauty  -----------------------------------

	//Paises
	const paisesValue = useSelector((state)=> state.generalState.paises)
	//Calles
	const calleValue = useSelector((state)=> state.generalState.calles)
	//Departamentos
	const dptos = useSelector((state)=> state.generalState.departamentos)
	//Provincias
	const provinciasValue = useSelector((state)=> state.generalState.provincias)
	//Localidades
	const localidadesValue = useSelector((state)=> state.generalState.localidades);
	//Barrios
	const barriosValue = useSelector((state)=> state.generalState.barrios)
	//Cargos
	const cargosValue = useSelector((state)=> state.generalState.cargos);
	//TareaDesempeñada
	const tareaValues = useSelector((state)=> state.generalState.tareaDesempeñada);
	//Formas de Pago
	const formasDePagoValue = useSelector((state)=> state.generalState.formasDePago)
	//ModosContratacion
	const modosContratacionValue = useSelector((state)=> state.generalState.modosContratacion)
	//Modos Liquidacion
	const modosLiquidacionValue = useSelector((state)=> state.generalState.modosLiquidacion);
	//Empleadores
	const empleadoresValue = useSelector((state)=> state.generalState.empleadores)
	// ----------------------------------- ID & PETITION  -----------------------------------
	//Estados Civiles
	const estadosCivilesValue = useSelector((state) => state.generalState.estadosCiviles);
	const estadoCivilSelected = useSelector((state) => state.modalState.estadoCivilSelected);
	const inputMascEstadosCiviles = useSelector((state) => state.modalState.formulario.inputEstadosCivilesModal);
	const inputFemEstadosCiviles = useSelector((state) => state.modalState.formulario.inputEstadosCivilesModalFem);
	const valueIdEstadoCivil = useSelector((state) => state.generalState.idEstadoCivil);
	

	// Estudios
	const estudiosValue = useSelector((state) => state.generalState.estudios)
	
	// Tipos de documento
	const tiposDocumentoValue = useSelector((state) => state.generalState.tiposDocumento)
	
	// Parentescos
	const parentescosValue = useSelector((state) => state.generalState.parentescos)
	const parentescoSelected = useSelector((state) => state.modalState.parentescoSelected)
	const inputParentesco = useSelector((state) => state.modalState.formulario.inputParentesco)
	const inputAsignacionParent = useSelector((state) => state.modalState.formulario.inputAsignacionParent)
	const inputGananciaParent = useSelector((state) => state.modalState.formulario.inputGananciaParent)
	const inputImporteParent = useSelector((state) => state.modalState.formulario.inputImporteParent)
	const textAreaParent = useSelector((state) => state.modalState.formulario.textAreaParent)
	const valueIdParentesco = useSelector((state) => state.generalState.idParentesco)
	// estados para los empleados
	const estadosValue = useSelector((state) => state.generalState.estados)
	// formas de pago
	const formasPagoValue = useSelector((state) => state.generalState.formasDePago)
	// tareas desempeñadas
	const tareasValue = useSelector((state) => state.generalState.tareasDesempeñadas)
//#endregion ----------------------------------- ESTADOS DECLARADOS de Lauty  -----------------------------------



//#region ----------------------------------- ID & PETITION REview -----------------------------------
	//Estados Civiles
	const idEstadoCivil = ((estadosCivilesValue && estadosCivilesValue[estadosCivilesValue.length -1] !== undefined && (estadosCivilesValue[estadosCivilesValue.length -1].idEstadoCivil))+1)
	const bodyEstadosCiviles = {
        idEstadoCivil : idEstadoCivil,
        masculino : modalValues?.masculino,
        femenino : modalValues?.femenino
    }
    const bodyUpdateEstadosCiviles = {
        idEstadoCivil : valueItemModal?.idEstadoCivil,
        masculino : modalValues?.masculino,
        femenino : modalValues?.femenino
    }
	//Estudios
	const bodyEstudios = {
		"iDestudios": ((estudiosValue && estudiosValue[estudiosValue.length - 1] !== undefined && (estudiosValue[estudiosValue.length - 1].iDestudios)) + 1),
		"estudiosNivel": modalValues?.estudiosNivel,
		"id" : null,
	}
	const bodyUpdateEstudios = {
		"iDestudios": valueItemModal?.iDestudios,
		"estudiosNivel": modalValues?.estudiosNivel,
		"id" : null,
	}
	
	//Tipo Documento
	const bodyTipoDocumento =
		{
		"iDtipoDocumento": ((tiposDocumentoValue && tiposDocumentoValue[tiposDocumentoValue.length - 1] !== undefined && (tiposDocumentoValue[tiposDocumentoValue.length - 1].iDtipoDocumento)) + 1),
		"tipoDocumento": modalValues?.tipoDocumento,
		"id": null
		}
	const bodyUpdateTipoDocumento = {
		"iDtipoDocumento": valueItemModal?.iDtipoDocumento, 
		"tipoDocumento": modalValues?.tipoDocumento,
		"id": null
	}

	
	//Estados
	const bodyEstado = {
		"idEstado": ((estadosValue && estadosValue[estadosValue.length - 1] !== undefined && (estadosValue[estadosValue.length - 1].idEstado)) + 1),
		"nombreEstado": modalValues?.nombreEstado,
		"observacion": modalValues?.observacion
	}
	const bodyUpdateEstado = {
		"idEstado": valueItemModal?.idEstado,
		"nombreEstado": modalValues?.nombreEstado,
		"observacion": modalValues?.observacion
	}

	//Formas de Pagos
	const bodyFormasDePago = {
		"iDformadePago": ((formasPagoValue && formasPagoValue[formasPagoValue.length - 1] !== undefined && (formasPagoValue[formasPagoValue.length - 1].iDformadePago)) + 1),
		"nombreFormadePago": modalValues?.nombreFormadePago,
		"obs": modalValues?.observacion
	}
	const bodyUpdateFormasDePago = {
		"iDformadePago": valueItemModal?.iDformadePago,
		"nombreFormadePago": modalValues?.nombreFormadePago,
		"obs": modalValues?.observacion
	}

	//Cargos
	const bodyCargo = {
		"iDcargo": ((cargosValue && cargosValue[cargosValue.length - 1] !== undefined && (cargosValue[cargosValue.length - 1].iDcargo)) + 1),
		"nombreCargo": modalValues?.nombreCargo,
		"observacion": modalValues?.observacion
	}
	const bodyUpdateCargo = {
		"iDcargo": valueItemModal?.iDcargo,
		"nombreCargo": modalValues?.nombreCargo,
		"observacion": modalValues?.observacion
	}

	//Tareas Desempeñadas

	const bodyTareas = {
		"idTareaDesempeñada" : ((tareasValue && tareasValue[tareasValue.length - 1] !== undefined && (tareasValue[tareasValue.length - 1].idTareaDesempeñada)) + 1),
		"tareaDesempeñada" : modalValues?.tareaDesempeñada,
		"observacion" : modalValues?.observacion
	}
	const bodyUpdateTareas = {
		"idTareaDesempeñada" : valueItemModal?.idTareaDesempeñada,
		"tareaDesempeñada" : modalValues?.tareaDesempeñada,
		"observacion" : modalValues?.observacion
	}

	//Modos Liquidación

	const bodyModosLiquidacion = {
		"iDmodoLiquidacion": ((modosLiquidacionValue && modosLiquidacionValue[modosLiquidacionValue.length - 1] !== undefined && (modosLiquidacionValue[modosLiquidacionValue.length - 1].iDmodoLiquidacion)) + 1),
		"nombreModoLiquidacion": modalValues?.nombreModoLiquidacion,
		"observacion": modalValues?.observacion
	}
	const bodyUpdateModosLiquidacion = {
		"iDmodoLiquidacion": valueItemModal?.iDmodoLiquidacion,
		"nombreModoLiquidacion": modalValues?.nombreModoLiquidacion,
		"observacion": modalValues?.observacion
	}

	//Calles
	const bodyCalle = {
		"idCalle": ((calleValue && calleValue[calleValue.length - 1] !== undefined && (calleValue[calleValue.length - 1].idCalle)) + 1),
		"calle": modalValues?.calle,
		"obs": modalValues?.observacion
	}
	const bodyUpdateCalle = {
		"idCalle": valueItemModal?.idCalle,
		"calle": modalValues?.calle,
		"obs": modalValues?.observacion
	}

	//Modos Contratación

	const bodyModosContratacion = {
		"iDmodoContratacion": ((modosContratacionValue && modosContratacionValue[modosContratacionValue.length - 1] !== undefined && (modosContratacionValue[modosContratacionValue.length - 1].iDmodoContratacion)) + 1),
		"modoContratacion": modalValues?.modoContratacion,
		"observacion": modalValues?.observacion,
		"fechaVto": modalValues?.fechaVto
	}
	const bodyUpdateModosContratacion = {
		"iDmodoContratacion": valueItemModal?.iDmodoContratacion,
		"modoContratacion": modalValues?.modoContratacion,
		"observacion": modalValues?.observacion,
		"fechaVto": modalValues?.fechaVto
	}
	
	console.log(bodyModosContratacion)
	

	//Parentescos
	//falta lógica
	const bodyParentesco = {
		"iDparentesco": ((parentescosValue && parentescosValue[parentescosValue.length - 1] !== undefined && (parentescosValue[parentescosValue.length - 1].iDparentesco)) + 1),
		"nombreParentesco": modalValues?.nombreParentesco,
		"observacion": modalValues?.observacion
	}
	const bodyUpdateParentesco = {
		"iDparentesco": valueItemModal?.iDparentesco,
		"nombreParentesco": modalValues?.nombreParentesco,
		"observacion": modalValues?.observacion
	}

	//Paises

	const bodyPaises = {
		"idPais": ((paisesValue && paisesValue[paisesValue.length - 1] !== undefined && (paisesValue[paisesValue.length - 1].idPais)) + 1),
		"nombrePais": modalValues?.nombrePais,
		"observacion": modalValues?.observacion
	}
	const bodyUpdatePaises = {
		"idPais": valueItemModal?.idPais,
		"nombrePais": modalValues?.nombrePais,
		"observacion": modalValues?.observacion
	}

	//Alicuotas

	//Provincias, Deptos y demás.
	
	const bodyProvincias = {
		"idProvincia": ((provinciasValue && provinciasValue[provinciasValue.length - 1] !== undefined && (provinciasValue[provinciasValue.length - 1].idProvincia)) + 1),
		"provincia": modalValues?.provincia,
		"observacion": modalValues?.observacion
	}
	const bodyUpdateProvincias = {
		"idProvincia": valueItemModal?.idProvincia,
		"provincia": modalValues?.provincia,
		"observacion": modalValues?.observacion
	}
	
	//Empleadores
	const bodyEmpleadores = {
		"iDempleador": ((empleadoresValue && empleadoresValue[empleadoresValue.length - 1] !== undefined && (empleadoresValue[empleadoresValue.length - 1].iDempleador)) + 1),
		"razonSocial": modalValues?.razonSocial,
		"cuit": modalValues?.cuit
	}
	const bodyUpdateEmpleadores = {
		"iDempleador": valueItemModal?.iDempleador,
		"razonSocial": modalValues?.razonSocial,
		"cuit": modalValues?.cuit
	}


	
	
	//Parentesco para después
	// const bodyParentesco = {
	// 	"iDparentesco": ((parentescosValue && parentescosValue[parentescosValue.length - 1] !== undefined && (parentescosValue[parentescosValue.length - 1].iDparentesco)) + 1),
	// 	"parentesco": modalValues?.parentesco,
	// 	"id": null
	// }
	// const bodyUpdateParentesco = {
	// 	"iDparentesco": valueItemModal?.iDparentesco,
	// 	"parentesco": modalValues?.parentesco,
	// 	"id": null
	// }

	//Motivos de Ingreso se deja para VERSION 2.0
	// const bodyMotivoIngreso = {
	// 	"iDmotivoIngreso": ((motivosIngresoValue && motivosIngresoValue[motivosIngresoValue.length - 1] !== undefined && (motivosIngresoValue[motivosIngresoValue.length - 1].iDmotivoIngreso)) + 1),
	// 	"nombreMotivoIngreso": modalValues?.nombreMotivoIngreso,
	// 	"observacion": modalValues?.observacion
	// }
	// const bodyUpdateMotivoIngreso = {
	// 	"iDmotivoIngreso": valueItemModal?.iDmotivoIngreso,
	// 	"nombreMotivoIngreso": modalValues?.nombreMotivoIngreso,
	// 	"observacion": modalValues?.observacion
	// }






//#endregion ----------------------------------- ID Review 2023  -----------------------------------
	
//#region ----------------------------------- Body de Lauty  -----------------------------------

	// //Parentescos
	// const idParentesco = ((parentescosValue && parentescosValue[parentescosValue.length - 1] !== undefined && (parentescosValue[parentescosValue.length - 1].iDparentesco)) + 1)
	// const bodyPetParentescos = { "iDparentesco": idParentesco ,
	// 							"nombreParentesco": responses.modalDataInputs?.nombreParentesco,
	// 							"generaAsignacion": responses.modalDataInputs?.generaAsignacion,
	// 							"obs": responses.modalDataInputs?.obs,
	// 							"deduceGanancias": responses.modalDataInputs?.deduceGanancias,
	// 							"importeDeduce": responses.modalDataInputs?.importeDeduce }
	// // cargos
	// const idCargo = ((cargosValue && cargosValue[cargosValue.length - 1] !== undefined && (cargosValue[cargosValue.length - 1].iDcargo)) + 1)
	// const bodyPetCargos = {
	// 						"iDcargo": idCargo,
	// 						"nombreCargo": responses.modalDataInputs?.nombreCargo,
	// 						"observacion": responses.modalDataInputs?.observacion
	// 					}
	// // tareas desempeñadas
	// const idTarea = ((tareasValue && tareasValue[tareasValue.length - 1] !== undefined && (tareasValue[tareasValue.length - 1].idTareaDesempeñada)) + 1)
	// const bodyPetTareas = {
	// 	"idTareaDesempeñada": idTarea,
	// 	"tareaDesempeñada": responses.modalDataInputs?.tareaDesempeñada,
	// 	"obs": responses.modalDataInputs?.obs
	// }

//#endregion ----------------------------------- Body de Lauty  -----------------------------------
	function showSuperadmin(){

		let perfilAdmin = perfilesUsuario && perfilesUsuario.filter((perfil)=> perfil.nombre.toLowerCase() === "administrador");
		console.log(perfilAdmin)
		if(perfilAdmin.length > 0){
			return(<Link class="nav-link" to="/superadmin">Superadmin</Link>)
		}else{
			return null;
		}
	}



	return (
		<nav className="row gy-3 navbar navbar-expand-lg navbar-light bg-light col-sm-12">
			<div className="container-sm">
				<button className="navbar-toggler" type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarNav"
					aria-controls="navbarNav"
					aria-expanded="false"
					aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="">
					<div className="collapse navbar-collapse" id="navbarNav">
						<ul className=" navbar-nav">
							<li className=" nav-item dropdown">
								<a className="  nav-link dropdown-toggle" href="" role="button" data-bs-toggle="dropdown" aria-expanded="false">
									Empleados
								</a>
								<ul className=" dropdown-menu">
									
									<li><Link className="dropdown-item" to="/ficha-empleados">Ficha Empleados</Link></li>
							
								</ul>
							</li>
							{/* <li className="nav-item">
								<a className="nav-link" href="/some/valid/uri">Liquidación</a>
							</li> 
							<li className="nav-item">
								<a className="nav-link" href="/some/valid/uri">Esquemas y Conceptos</a>
							</li>
							<li className="nav-item">
								<a className="nav-link" href="/some/valid/uri">Períodos</a>
							</li>*/}
							<li className="nav-item dropdown">
								<a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
									Tabla de Datos
								</a>
								<ul className="dropdown-menu">
									<li class="dropdown-submenu">
										<a className='dropdown-item' tabindex="-1" href="#">Para Empleados</a>
										<ul class="dropdown-menu">
											<div className="datosEmpleados" style={{ fontSize: "13px" }}>
												<li>
													<ButtonCallModal nameModal={nameModal} setNameModal={setNameModal}  nameModalProp="estadosCiviles"  setTransition={setTransition} nameButton="Estados Civiles">
														<ChildModal 
															modalValues={modalValues} 
															onChangeValues={onChangeValues}  
															valueItemModal={valueItemModal} 
															setValueItemModal={setValueItemModal} 
															nameModalProp="estadosCiviles" 
															handleClickClose={handleClickClose} 
															setTransition={setTransition} 
															array={estadosCivilesValue && estadosCivilesValue}  
															nameModal="Estados Civiles" 
															propsModal={propsModal} 
															optionsInputs={objectEstadosCiviles} 
															transition={transition}
															functionAdd={sendModalData}
															urlApi={urlEstadosCiviles}
															bodyPetition ={bodyEstadosCiviles}
															bodyUpdate={bodyUpdateEstadosCiviles}
															modify={modify} 
															setModify={setModify}
															idAModificar={valueItemModal?.idEstadoCivil}
															functionDelete={deleteItemModal}
															disableModal={disableModal}
															setDisableMOdal={setDisableMOdal}
															actionActualizaDelete={actualizaDelete}
															

															disableModalButtons={disableModalButtons}
															setDisableModalButtons={setDisableModalButtons}
															usaEstados={false}
														/>
													</ButtonCallModal>
												</li>
												<li>
													<ButtonCallModal nameModal={nameModal} setNameModal={setNameModal}  nameModalProp="Estudios"  setTransition={setTransition} nameButton="Estudios">

														<ChildModal
															modalValues={modalValues}
															onChangeValues={onChangeValues}
															valueItemModal={valueItemModal}
															setValueItemModal={setValueItemModal}
															nameModalProp="Estudios"
															handleClickClose={handleClickClose}
															setTransition={setTransition}
															array={estudiosValue && estudiosValue}
															nameModal="Estudios"
															propsModal={ propsModalEstudios }
															optionsInputs={objectEstudios}
															transition={transition}
															functionAdd={sendModalData}
															urlApi={urlEstudios}
															bodyPetition ={bodyEstudios}
															bodyUpdate={bodyUpdateEstudios}
															modify={modify}
															setModify={setModify}
															idAModificar={valueItemModal?.iDestudios}
															functionDelete={deleteItemModal}
															disableModal={disableModal}
															setDisableMOdal={setDisableMOdal}
															disableModalButtons={disableModalButtons}
															setDisableModalButtons={setDisableModalButtons}
															actionActualizaDelete={actualizaDelete}
															usaEstados={false}
														/>
														
													</ButtonCallModal>
												</li>
											<li>
													<ButtonCallModal nameModal={nameModal} setNameModal={setNameModal}  nameModalProp="TipoDocumento"  setTransition={setTransition} nameButton="Tipo de Documento">
														<ChildModal 
															modalValues={modalValues} 
															onChangeValues={onChangeValues}  
															valueItemModal={valueItemModal} 
															setValueItemModal={setValueItemModal} 
															nameModalProp="TipoDocumento" 
															handleClickClose={handleClickClose} 
															setTransition={setTransition} 
															array={ tiposDocumentoValue && tiposDocumentoValue }  
															nameModal="Tipo de Documento" 
															propsModal={propsModalTiposDocumento} 
															optionsInputs={objectTipoDocumento} 
															transition={transition}
															functionAdd={sendModalData}
															urlApi={urlTiposDocumento}
															bodyPetition ={bodyTipoDocumento}
															bodyUpdate={bodyUpdateTipoDocumento}
															modify={modify} 
															setModify={setModify}
															idAModificar={ valueItemModal?.iDtipoDocumento }
															functionDelete={deleteItemModal}
															disableModal={disableModal}
															setDisableMOdal={setDisableMOdal}
															actionActualizaDelete={actualizaDelete}
															disableModalButtons={disableModalButtons}
															setDisableModalButtons={setDisableModalButtons}
															usaEstados={false}
														/>
														
													</ButtonCallModal>
												</li>    
												<li>
												<ButtonCallModal nameModal={nameModal} setNameModal={setNameModal}  nameModalProp="Estado"  setTransition={setTransition} nameButton="Estado">
														<ChildModal 
															modalValues={modalValues} 
															onChangeValues={onChangeValues}  
															valueItemModal={valueItemModal} 
															setValueItemModal={setValueItemModal} 
															nameModalProp="Estado" 
															handleClickClose={handleClickClose} 
															setTransition={setTransition} 
															array={ estadosValue && estadosValue }  
															nameModal="Estado" 
															propsModal={ propsModalEstado } 
															optionsInputs={objectEstado} 
															transition={transition}
															functionAdd={sendModalData}
															urlApi={urlEstado}
															bodyPetition ={bodyEstado}
															bodyUpdate={ bodyUpdateEstado }
															modify={modify} 
															setModify={setModify}
															idAModificar={ valueItemModal?.idEstado }
															functionDelete={deleteItemModal}
															disableModal={disableModal}
															setDisableMOdal={setDisableMOdal}
															disableModalButtons={disableModalButtons}
															setDisableModalButtons={setDisableModalButtons}
															actionActualizaDelete={actualizaDelete}
															//props texarea
															idInputTextArea="observacion"
															usaEstados={true}
															/>
														
													</ButtonCallModal>
												</li>
												<li>
												<ButtonCallModal nameModal={nameModal} setNameModal={setNameModal}  nameModalProp="Formas de Pagos"  setTransition={setTransition} nameButton="Formas de Pagos">
														<ChildModal 
															modalValues={modalValues} 
															onChangeValues={onChangeValues}  
															valueItemModal={valueItemModal} 
															setValueItemModal={setValueItemModal} 
															nameModalProp="Formas de Pagos" 
															handleClickClose={handleClickClose} 
															setTransition={setTransition} 
															array={ formasPagoValue && formasPagoValue }  
															nameModal="Formas de Pagos" 
															propsModal={ propsModalFormasdePagos } 
															optionsInputs={objectFormasDePago} 
															transition={transition}
															functionAdd={sendModalData}
															urlApi={urlFormasdePago}
															bodyPetition ={bodyFormasDePago}
															bodyUpdate={ bodyUpdateFormasDePago }
															modify={modify} 
															setModify={setModify}
															idAModificar={ valueItemModal?.iDformadePago }
															functionDelete={deleteItemModal}
															disableModal={disableModal}
															setDisableMOdal={setDisableMOdal}
															disableModalButtons={disableModalButtons}
															setDisableModalButtons={setDisableModalButtons}
															actionActualizaDelete={actualizaDeleteFormasdePago}
															actualizaCreaFormasdePago={actualizaCreaFormasdePago}
															actualizaModificarFormasdePago={
																actualizaModificarFormasdePago}
															//props texarea
															idInputTextArea="observacion"
															usaEstados={true}
															/>
													</ButtonCallModal>
												</li>
												<li>
													<ButtonCallModal nameModal={nameModal} setNameModal={setNameModal}  nameModalProp="Calles"  setTransition={setTransition} nameButton="Calles">
														<ChildModal 
															modalValues={modalValues} 
															onChangeValues={onChangeValues}  
															valueItemModal={valueItemModal} 
															setValueItemModal={setValueItemModal} 
															nameModalProp="Calles" 
															handleClickClose={handleClickClose} 
															setTransition={setTransition} 
															array={ calleValue && calleValue }  
															nameModal="Calles" 
															propsModal={propsModalCalles} 
															optionsInputs={objectCalles} 
															transition={transition}
															functionAdd={sendModalData}
															urlApi={urlCalles}
															bodyPetition ={bodyCalle}
															bodyUpdate={bodyUpdateCalle}
															modify={modify} 
															setModify={setModify}
															idAModificar={ valueItemModal?.idCalle }
															functionDelete={deleteItemModal}
															disableModal={disableModal}
															setDisableMOdal={setDisableMOdal}
															actionActualizaDelete={actualizaDelete}
															disableModalButtons={disableModalButtons}
															setDisableModalButtons={setDisableModalButtons}
															usaEstados={false}
														/>
														
													</ButtonCallModal>
												</li>    
												<li>
													<ButtonCallModal nameModal={nameModal} setNameModal={setNameModal}  nameModalProp="Cargos"  setTransition={setTransition} nameButton="Cargos">
														<ChildModalOptions 
															modalValues={modalValues} 
															onChangeValues={onChangeValues}  
															valueItemModal={valueItemModal} 
															setValueItemModal={setValueItemModal} 
															nameModalProp="Cargos" 
															handleClickClose={handleClickClose} 
															setTransition={setTransition} 
															array={ cargosValue && cargosValue }  
															nameModal="Cargos" 
															propsModal={propsModalCargos} 
															optionsInputs={objectCargos} 
															transition={transition}
															functionAdd={sendModalData}
															urlApi={urlCargos}
															bodyPetition ={bodyCargo}
															bodyUpdate={bodyUpdateCargo}
															modify={modify} 
															setModify={setModify}
															idAModificar={ valueItemModal?.idCargo }
															functionDelete={deleteItemModal}
															disableModal={disableModal}
															setDisableMOdal={setDisableMOdal}
															actionActualizaDelete={actualizaDelete}
															disableModalButtons={disableModalButtons}
															setDisableModalButtons={setDisableModalButtons}
															usaEstados={true}
															usaCheck={false}
														/>
													</ButtonCallModal>
												</li>    
												<li>
													<ButtonCallModal nameModal={nameModal} setNameModal={setNameModal}  nameModalProp="Tareas Desempeñadas"  setTransition={setTransition} nameButton="Tareas Desempeñadas">
														<ChildModalOptions 
															modalValues={modalValues} 
															onChangeValues={onChangeValues}  
															valueItemModal={valueItemModal} 
															setValueItemModal={setValueItemModal} 
															nameModalProp="Tareas Desempeñadas" 
															handleClickClose={handleClickClose} 
															setTransition={setTransition} 
															array={ tareasValue && tareasValue  }  
															nameModal="Tareas Desempeñadas" 
															propsModal={propsModalTareas} 
															optionsInputs={objectTareas} 
															transition={transition}
															functionAdd={sendModalData}
															urlApi={urlTareas}
															bodyPetition ={bodyTareas}
															bodyUpdate={bodyUpdateTareas}
															modify={modify} 
															setModify={setModify}
															idAModificar={ valueItemModal?.idTareaDesempeñada }
															functionDelete={deleteItemModal}
															disableModal={disableModal}
															setDisableMOdal={setDisableMOdal}
															actionActualizaDelete={actualizaDelete}
															disableModalButtons={disableModalButtons}
															setDisableModalButtons={setDisableModalButtons}
															usaEstados={true}
															usaCheck={false}
														/>
													</ButtonCallModal>
												</li>    
												<li>
													<ButtonCallModal nameModal={nameModal} setNameModal={setNameModal}  nameModalProp="Modos de Liquidacion"  setTransition={setTransition} nameButton="Modos de Liquidacion">
														<ChildModalOptions 
															modalValues={modalValues} 
															onChangeValues={onChangeValues}  
															valueItemModal={valueItemModal} 
															setValueItemModal={setValueItemModal} 
															nameModalProp="Modos de Liquidacion" 
															handleClickClose={handleClickClose} 
															setTransition={setTransition} 
															array={ modosLiquidacionValue && modosLiquidacionValue  }  
															nameModal="Modos de Liquidacion" 
															propsModal={propsModalModosLiquidacion} 
															optionsInputs={objectModosLiquidacion} 
															transition={transition}
															functionAdd={sendModalData}
															urlApi={urlModosLiquidacion}
															bodyPetition ={bodyModosLiquidacion}
															bodyUpdate={bodyUpdateModosLiquidacion}
															modify={modify} 
															setModify={setModify}
															idAModificar={ valueItemModal?.iDmodoLiquidacion }
															functionDelete={deleteItemModal}
															disableModal={disableModal}
															setDisableMOdal={setDisableMOdal}
															actionActualizaDelete={actualizaDelete}
															disableModalButtons={disableModalButtons}
															setDisableModalButtons={setDisableModalButtons}
															usaEstados={true}
															usaCheck={false}
														/>
													</ButtonCallModal>
												</li>    
												<li>
													<ButtonCallModal nameModal={nameModal} setNameModal={setNameModal}  nameModalProp="Modos de Contratacion"  setTransition={setTransition} nameButton="Modos de Contratacion">
														<ChildModalOptions 
															modalValues={modalValues} 
															onChangeValues={onChangeValues}  
															valueItemModal={valueItemModal} 
															setValueItemModal={setValueItemModal} 
															nameModalProp="Modos de Contratacion" 
															handleClickClose={handleClickClose} 
															setTransition={setTransition} 
															array={ modosContratacionValue && modosContratacionValue  }  
															nameModal="Modos de Contratacion" 
															propsModal={propsModalModosContratacion} 
															optionsInputs={objectModosContratacion} 
															transition={transition}
															functionAdd={sendModalData}
															urlApi={urlModosContratacion}
															bodyPetition ={bodyModosContratacion}
															bodyUpdate={bodyUpdateModosContratacion}
															modify={modify} 
															setModify={setModify}
															idAModificar={ valueItemModal?.iDmodoContratacion }
															functionDelete={deleteItemModal}
															disableModal={disableModal}
															setDisableMOdal={setDisableMOdal}
															actionActualizaDelete={actualizaDelete}
															disableModalButtons={disableModalButtons}
															setDisableModalButtons={setDisableModalButtons}
															usaEstados={true}
															usaCheck={true}
														/>
													</ButtonCallModal>
												</li>    
												<li>
													<ButtonCallModal nameModal={nameModal} setNameModal={setNameModal}  nameModalProp="Parentescos"  setTransition={setTransition} nameButton="Parentescos">
														<ModalParentesco 
															modalValues={modalValues} 
															onChangeValues={onChangeValues}  
															valueItemModal={valueItemModal} 
															setValueItemModal={setValueItemModal} 
															nameModalProp="Parentescos" 
															handleClickClose={handleClickClose} 
															setTransition={setTransition} 
															array={ parentescosValue && parentescosValue  }  
															nameModal="Parentescos" 
															propsModal={propsModalParentesco} 
															optionsInputs={objectParentescos} 
															transition={transition}
															functionAdd={sendModalData}
															urlApi={urlParentescos}
															bodyPetition ={bodyParentesco}
															bodyUpdate={bodyUpdateParentesco}
															modify={modify} 
															setModify={setModify}
															idAModificar={ valueItemModal?.iDparentesco }
															functionDelete={deleteItemModal}
															disableModal={disableModal}
															setDisableMOdal={setDisableMOdal}
															actionActualizaDelete={actualizaDelete}
															disableModalButtons={disableModalButtons}
															setDisableModalButtons={setDisableModalButtons}
															usaEstados={true}
															nameInputCheck="Genera Asignación"
															nameInputCheckTwo="Deduce Ganancias"
															nameLabelValorDeduccion="Importe"
															// checked={valueItemModal?.generaAsignacion}
														/>
													</ButtonCallModal>
												</li>    
												<li>
													<ButtonCallModal nameModal={nameModal} setNameModal={setNameModal}  nameModalProp="Paises"  setTransition={setTransition} nameButton="Paises">
														<ModalPaises 
															modalValues={modalValues} 
															onChangeValues={onChangeValues}  
															valueItemModal={valueItemModal} 
															setValueItemModal={setValueItemModal} 
															nameModalProp="Paises" 
															handleClickClose={handleClickClose} 
															setTransition={setTransition} 
															array={ paisesValue && paisesValue }  
															nameModal="Paises" 
															propsModal={propsModalPaises} 
															optionsInputs={objectPaises} 
															transition={transition}
															functionAdd={sendModalData}
															urlApi={urlPaises}
															bodyPetition ={bodyPaises}
															bodyUpdate={bodyUpdatePaises}
															modify={modify} 
															setModify={setModify}
															idAModificar={ valueItemModal?.idPais }
															functionDelete={deleteItemModal}
															disableModal={disableModal}
															setDisableMOdal={setDisableMOdal}
															actionActualizaDelete={actualizaDelete}
															disableModalButtons={disableModalButtons}
															setDisableModalButtons={setDisableModalButtons}
															// usaEstados={true}
															// nameInputCheck="Genera Asignación"
															// nameInputCheckTwo="Deduce Ganancias"
															// nameLabelValorDeduccion="Importe"
															// checked={valueItemModal?.generaAsignacion}
														/>
													</ButtonCallModal>
												</li>    
												<li>
												<ButtonCallModal nameModal={nameModal} setNameModal={setNameModal}  nameModalProp="Provincias - Localidades - Departamentos - Barrios "  setTransition={setTransition} nameButton="Provincias - Localidades - Departamentos - Barrios ">
														<ModalProvinciasDptos 
															modalValues={modalValues} 
															onChangeValues={onChangeValues}  
															valueItemModal={valueItemModal} 
															setValueItemModal={setValueItemModal} 
															nameModalProp="Provincias - Localidades - Departamentos - Barrios " 
															handleClickClose={handleClickClose} 
															setTransition={setTransition} 
															array={ provinciasValue && provinciasValue }  
															nameModal="Provincias - Localidades - Departamentos - Barrios " 
															propsModal={propsModalProvincias} 
															optionsInputs={objectProvincias} 
															transition={transition}
															functionAdd={sendModalData}
															urlApi={urlProvincias}
															bodyPetition ={bodyProvincias}
															bodyUpdate={bodyUpdateProvincias}
															modify={modify} 
															setModify={setModify}
															idAModificar={ valueItemModal?.idProvincia }
															functionDelete={deleteItemModal}
															disableModal={disableModal}
															setDisableMOdal={setDisableMOdal}
															actionActualizaDelete={actualizaDelete}
															disableModalButtons={disableModalButtons}
															setDisableModalButtons={setDisableModalButtons}
															usaEstados={true}
														/>
													</ButtonCallModal>
												</li>  
												
											</div>
										</ul>
									</li>
											<div className="datosLiquidacion" style={{ fontSize: "13px" }}>
											</div>
										</ul>
									</li> 
									<li class="nav-item">
										<a class="nav-link" onClick={()=> closeSession()} href="http://www.loginweb.ggmm.com.ar/" target="_blank">Salir</a>
									</li>
									{
										<li class="nav-item">
											{
												showSuperadmin()
											}
										</li>
									}									
								</ul>
								<ul> 
								</ul>
			</div> 
			</div> 
			</div> 
			</nav>
)}

export default NavbarMenu;