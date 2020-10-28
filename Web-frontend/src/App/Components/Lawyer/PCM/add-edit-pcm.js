import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col, Breadcrumb, Image, Form, Button } from "react-bootstrap";
import { Home, Close } from "@material-ui/icons";
import { Link, Redirect } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { AddPCMdata, UploadDocument, GetPCMDetails, DeleteDocuments } from '../../../Services/pcm-service';
import { GetCurrentUser, GetCurrentUserAdvocateId, isNumberKey, getDistricts, getDistrictsStates, getCurrentActiveCase, setCurrentCaseNumber } from '../../../Services/common-service';
import { notifySuccess, notifyError } from '../../../Services/toaster-service';
import { useHistory } from "react-router-dom";
import FileICon from '../../../assets/images/file-icon.png';
import Can from "../../Can";
import rules from "../../../../rbac-rules";
import Moment from "moment";
import { CalendarAddService } from "../../../Services/calendar-service";

const InitialPCMFormData = {
    name: "",
    phone: "",
    address: "",
    district: "",
    state: "",
    country: "India",
    pin_code: "",
    case_num: "",
    case_type: "",
    case_model: "",
    court_name: "",
    opposition_name: "",
    registration_date: "",
    adjourn_date: "",
    notes: ""
}

const EditPCM = () => {

    let case_number  = getCurrentActiveCase();
    const advocate_id = GetCurrentUserAdvocateId();
    let history = useHistory();
    const userDetails = GetCurrentUser();
    const user_type = userDetails != null ? userDetails.user_type : "";

    // form data handling
    let setState = React.createRef();
    let selectedState = '', selectedDistrict = '';
    const handleDistrictChange = (event, value) => {       
        const district = districts.find(district => district.district === event.target.value);
        // console.log(district.state);
        console.log(formData);
        setState.current.value = district.state;
        updateFormData({
            ...formData,
            state: district.state,
            district: event.target.value
        })
        // formData.state = district.state;
        // formData.district = event.target.value;
    };

    const pcmData = useCallback(() => {
        if(case_number){
            GetPCMDetails(case_number).then(data => {
                // console.log(data);
                if(data){
                    updateFormData({
                        name: data.party[0].name,
                        phone: data.party[0].phone,
                        address: data.party[0].address,
                        district: data.party[0].district,
                        state: data.party[0].state,
                        country: data.party[0].country,
                        pin_code: data.party[0].pin_code,
                        case_num: data.case_num,
                        case_type: data.case_details.case_type,
                        case_model: data.case_details.case_model,
                        court_name: data.case_details.court_name,
                        opposition_name: data.case_details.opposition_name,
                        registration_date: data.case_details.registration_date,
                        adjourn_date: data.case_details.adjourn_date,
                        notes: data.case_details.notes
                    });
                    // console.log(formData);
                    setFormValidation(true);
                    setFiles(data.documents);
                }
            });
        }
        getDistricts().then(response => {
            setDistricts(response);
        })
        getDistrictsStates().then(response => {        
            setStates(response.states);
            setCountries(response.countries);
        });

    }, [])

    useEffect(() => {
        // console.log("inside edit-pcms useEffect...");        
        pcmData();
    }, [pcmData]);

    const [formData, updateFormData] = React.useState(InitialPCMFormData);
    const [isFormValid, setFormValidation] = useState(false);
    const [partyNameError, setPartyNameError] = useState(false);
    const [caseNumberError, setCaseNumberError] = useState(false);
    const [districts, setDistricts] = useState([]);
    const [states, setStates] = useState([]);
    const [countries, setCountries] = useState([]);

    const checkFormValidation = (event) => {
        switch(event.target.name){
            case 'name':
                if(event.target.value === '') setPartyNameError(true);
                else setPartyNameError(false);
                break;
            case 'case_num':
                if(event.target.value === ''){
                    setFormValidation(false);
                    setCaseNumberError(true);
                }else{
                    setFormValidation(true);
                    setCaseNumberError(false);
                }
                break;            
            default:               
                break;
        }
    }

    const handleInputChange = (event) => {              
        checkFormValidation(event);
        updateFormData({
            ...formData,        
            // Trimming any whitespace .trim()
            [event.target.name]: event.target.value            
        });
    };

    const handleSubmit = (event) => {
        // console.log(event);
        event.preventDefault()
        // console.log(formData);
        let data = {
            case_num: formData.case_num,            
            advocate_id: advocate_id,
            party: [
                {
                    name: formData.name,
                    phone: formData.phone,
                    address: formData.address,
                    district: formData.district,
                    state: formData.state,
                    country: formData.country,
                    pin_code: formData.pin_code 
                }
            ],
            case_details: {
                case_type: formData.case_type,
                case_model: formData.case_model,
                court_name: formData.court_name,
                opposition_name: formData.opposition_name,
                registration_date: formData.registration_date,
                adjourn_date: formData.adjourn_date,
                notes: formData.notes
            }
        }
        // addCalenderEvent(formData.case_num, formData.adjourn_date, formData.adjourn_date)

        AddPCMdata(data).then(status => {
            // console.log('idhr aaya...');
            if(status === "200"){
                // console.log('success ho gya...');
                setCurrentCaseNumber("");               
                addCalenderEvent(formData.case_num, formData.adjourn_date, formData.adjourn_date)
                updateFormData({...InitialPCMFormData});
                notifySuccess("Success!");
                history.push('/pcm');
            }else{
                // console.log('error');
                notifyError("Something went wrong!");
            }
        });
    };

    const addCalenderEvent = (summary, start_date, end_date) => {
        const data = {
            summary,
            start: { dateTime: Moment(start_date).format("YYYY-MM-DD") + "T08:30:00+05:30"},
            end: { dateTime: Moment(end_date).format("YYYY-MM-DD") + "T09:00:00+05:30"}
        }
        console.log(data);
        CalendarAddService(data).then((response) => {
            console.log(response);            
        });
    }

    // drop-zone for file handling
    const [files, setFiles] = useState([]);
    const {getRootProps, getInputProps } = useDropzone({
        accept: 'image/*,.pdf,.doc,.docx',
        onDrop: (acceptedFiles) => {
            if(formData.case_num){
                const documents = uploadPCMDocument(acceptedFiles);
                // console.log(documents);                
                setFiles([...documents, ...files]);
            }else{
                notifyError("Case Number is Required!");
            }                                    
        },
        multiple: true
    });

    const uploadPCMDocument = (acceptedFiles) => {
        return acceptedFiles.map(file => {
            // console.log(file);
            const reader = new FileReader();
            const ext = file.name.split('.')[1];
            let base64Str = '';
            reader.onabort = () => console.log('file reading was aborted')
            reader.onerror = () => console.log('file reading has failed')
            reader.onload = () => {
            // Do whatever you want with the file contents
                const binaryStr = reader.result                    
                base64Str = btoa(binaryStr);                    
                const obj = {
                    case_num: formData.case_num,
                    advocate_id: advocate_id,
                    doc: base64Str,
                    doc_name: file.name
                }
                
                UploadDocument(obj).then(status => {
                    console.log(status);
                    if(status === '200'){
                        notifySuccess("Document Uploaded successfully!");                        
                    }else notifyError("Uploading Error!");
                });                        
            }
            reader.readAsBinaryString(file);
            // console.log(ext);
            return Object.assign(file, {
                value: URL.createObjectURL(file),
                extension: ext,
                isBlob: true,
                item_key: advocate_id + '/' + formData.case_num + '/' + file.name
            })            
        });
    }    

    const thumbnails = files.map((file, i) => (
        <li className="list-group-item" key={file.name}>
            <div className="form-row align-items-center" style={{justifyContent: 'space-between'}}>
                <a rel="noopener noreferrer" href={(file.extension != 'pdf' && file.extension != 'doc' && file.extension != 'docx')  ? (file.isBlob ? file.value : "data:image/"+file.extension+";base64," + file.value) : (file.isBlob ? file.value : "data:application/"+file.extension+";base64," + file.value)} download={file.name} style={{textDecoration: 'none',color: 'initial', display: 'flex', flex: '1'}} key={i}>
                    <div className="col-auto" style={{padding: '0 5px'}}>
                        <div className="avatar">                        
                            <Image src={(file.extension != 'pdf' && file.extension != 'doc' && file.extension != 'docx') ? (file.isBlob ? file.value : "data:image/"+file.extension+";base64," + file.value) : FileICon } className="avatar-img rounded" alt={file.name}></Image>                            
                        </div>
                    </div>
                    <div className="col" style={{padding: '0 5px'}}>
                        <div className="font-weight-bold" data-dz-name>{file.name}</div>
                        <p className="small text-muted mb-0" data-dz-size>
                            <strong>{(file.size / 1000).toFixed(2)}</strong> KB
                        </p>
                    </div>
                </a>
                <div className="col-auto">
                    <span className="text-muted-light" onClick={() => remove(i, file.name)} data-dz-remove>
                        <Close></Close>
                    </span>
                </div>
            </div>
        </li>
    ));

    const remove = (index, file_name = '') => {      
        if(file_name){
            const newFiles = [...files];     // make a var for the new array
            newFiles.splice(index, 1);        // remove the file from the array
            DeleteDocuments(case_number, file_name).then(status => {
                if(status === '200'){
                    setFiles(newFiles);
                    notifySuccess('Document Removed Successfully!');
                }else{
                    notifyError('Error on removing documents!');
                }
            })
            setFiles(newFiles);
        }else{            
            notifyError('Document Key is Required!');
        }
    };    

    useEffect(() => {
        // Make sure to revoke the data uris to avoid memory leaks               
        files.forEach(file => URL.revokeObjectURL(file.preview));
    }, [files]);    

    // return (
        
    // );

    return <Can
        role={user_type}
        perform="pcm:edit"
        yes={() => (
                  <>
                    <Container fluid style={{ paddingTop: "12px" }}>
                        <Row className="item-flex-center m-0">
                            <Row className="item-flex-start m-0">
                                <Breadcrumb>
                                    <Breadcrumb.Item href="#">
                                        <Home className="breadcrumb-home-icon"></Home>
                                    </Breadcrumb.Item>
                                    <Breadcrumb.Item active className="breadcrumb-active">
                                        PCM
                                    </Breadcrumb.Item>
                                    <Breadcrumb.Item active className="breadcrumb-active">
                                        EDIT PCM
                                    </Breadcrumb.Item>
                                </Breadcrumb>
                                <h1 className="m-0">Edit/New PCM</h1>
                            </Row>
                            <div>
                                <Button className="btn btn-success ml-1" onClick={handleSubmit} disabled={!isFormValid}>Save</Button>
                                <Link to="/pcm" className="btn btn-light ml-1">Cancel</Link>
                            </div>
                        </Row>
                    </Container>
                    <Container fluid style={{ paddingTop: "18px" }}>
                        <Row>
                            <Col lg={12} className="p-0 mt-2">
                                <div className="container-fluid page__container">
                                {/* <Form> */}
                                        <div className="card card-form">
                                        <div className="row no-gutters">
                                            <div className="col-lg-12 card-form__body card-body">
                                            <div className="col-lg-12">
                                                <p>
                                                <strong className="headings-color">
                                                    Party Details
                                                </strong>
                                                </p>
                                            </div>
                                            <Form.Row className="form-group col-lg-12 ">
                                                <div className="col-lg-6">
                                                <label htmlFor="name">Party Full Name</label>
                                                <input
                                                    id="name"
                                                    type="text"
                                                    className={`form-control ${partyNameError ? 'is-invalid' : ''}`}
                                                    placeholder="Full name"
                                                    name="name"
                                                    value={formData.name}                                                                                      
                                                    onChange={handleInputChange}
                                                    autoComplete="nope"
                                                    required
                                                />                                        
                                                <small className={`invalid-feedback m-0 mt-1 ${partyNameError ? '': 'd-none'}`}>Party name is required!</small>
                                                </div>
                                                <div className="col-lg-6">
                                                <label htmlFor="phone">Phone Number</label>
                                                <input
                                                    id="phone"
                                                    name="phone"
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter Phone Number"
                                                    value={formData.phone}
                                                    minLength="10"
                                                    maxLength="10"  
                                                    onKeyPress={isNumberKey}                                            
                                                    onChange={handleInputChange}
                                                    autoComplete="nope"                                            
                                                />
                                                </div>
                                            </Form.Row>
                                            <div className="form-group col-lg-12">
                                                <label htmlFor="address">Address</label>
                                                <textarea
                                                id="address"
                                                name="address"
                                                rows="4"
                                                className="form-control"
                                                placeholder="Address ..."
                                                value={formData.address}  
                                                onChange={handleInputChange}
                                                ></textarea>
                                            </div>
                                                <div className="form-group col-md-3 float-left">
                                                    <label htmlFor="district">District</label>
                                                    <br />
                                                    {/* <select
                                                    id="district"
                                                    name="district"
                                                    className="custom-select"
                                                    style={{ width: "auto" }}
                                                    value={formData.district}  
                                                    onChange={handleInputChange}
                                                    >
                                                    <option value="Hyderabad" selected="true">Hyderabad</option>
                                                    </select> */}
                                                    <Form.Control
                                                    as="select"
                                                    name="district"                                                    
                                                    className="custom-select"
                                                    id="district"   
                                                    custom
                                                    style={{ width: '111px' }}
                                                    value={formData.district} 
                                                    onChange={handleDistrictChange.bind(this)}
                                                    >
                                                    {districts.map((district, i) =>
                                                        <option value={district.district} key={i}>
                                                            {district.district}
                                                        </option>
                                                    )}
                                                    </Form.Control>                                                   
                                                </div>
                                                <div className="form-group col-md-3 float-left">
                                                    <label htmlFor="state">State</label>
                                                    <br />
                                                    {/* <select
                                                    id="state"
                                                    name="state"
                                                    className="custom-select"
                                                    style={{ width: "auto" }}
                                                    value={formData.state}  
                                                    onChange={handleInputChange}
                                                    >
                                                    <option value="Telangana">Telangana</option>
                                                    <option value="Telangana" selected="true">Maharastra</option>
                                                    </select> */}
                                                    <Form.Control
                                                    as="select"
                                                    name="state"                                                    
                                                    className="custom-select"
                                                    id="state"
                                                    custom
                                                    style={{ width: "111px" }}
                                                    value={formData.state} 
                                                    onChange={handleInputChange}
                                                    ref={setState}
                                                    >
                                                        {states.map((state, i) =>
                                                        <option value={state} key={i}>
                                                            {state}
                                                        </option>
                                                    )}
                                                        {/* <option value="Telangana">Telangana</option>
                                                        <option value="Maharastra">Maharastra</option> */}
                                                    </Form.Control>
                                                </div>
                                                <div className="form-group col-md-3 float-left">
                                                    <label htmlFor="country">Country</label>
                                                    <br />
                                                    {/* <select
                                                    id="country"
                                                    name="country"
                                                    className="custom-select"
                                                    style={{ width: "auto" }}
                                                    value={formData.country}
                                                    onChange={handleInputChange}
                                                    >
                                                    <option value="India">India</option>
                                                    </select> */}
                                                    <Form.Control
                                                    as="select"
                                                    name="country"                                                    
                                                    className="custom-select"
                                                    id="country"
                                                    custom
                                                    style={{ width: '111px' }}
                                                    value={formData.country} 
                                                    onChange={handleInputChange}                                                    
                                                    >
                                                        {countries.map((country, i) =>
                                                        <option value={country} key={i}>
                                                            {country}
                                                        </option>
                                                    )}                                                       
                                                    </Form.Control>
                                                </div>
                                                <div className="form-group col-md-3 float-left">
                                                    <label htmlFor="pin_code">Pin Code</label>
                                                    <input
                                                    id="pin_code"
                                                    name="pin_code"
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Pincode"
                                                    value={formData.pin_code}
                                                    onChange={handleInputChange}
                                                    autoComplete="nope"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        </div>

                                        <div className="card card-form">
                                        <div className="row no-gutters">
                                            <div className="col-lg-12 card-form__body card-body">
                                            <div className="col-lg-12">
                                                <p>
                                                <strong className="headings-color">
                                                    Case Details
                                                </strong>
                                                </p>
                                            </div>
                                            <Form.Row className="col-lg-12">
                                                <div className="form-group col-lg-4 float-left">
                                                <label htmlFor="case_number">Case Number</label>
                                                <input
                                                    id="case_number"
                                                    name="case_num"
                                                    type="text"
                                                    className={`form-control ${caseNumberError ? 'is-invalid': ''}`}
                                                    placeholder="Enter Case Number"
                                                    value={formData.case_num}
                                                    autoComplete="nope"
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                                <small className={`invalid-feedback m-0 mt-1 ${caseNumberError ? '': 'd-none'}`}>Case Number is required!</small>                                        
                                                </div>
                                                <div className="form-group col-lg-4 float-left">
                                                <label htmlFor="case_type">Case Type</label>
                                                <br />
                                                <input
                                                    id="case_type"
                                                    name="case_type"
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter Case Type"
                                                    value={formData.case_type}
                                                    onChange={handleInputChange}
                                                />                                               
                                                </div>
                                                <div className="form-group col-lg-4 float-left">
                                                    <label htmlFor="case_model">Case Model</label>
                                                    <br />
                                                    {/* <input
                                                        id="case_model"
                                                        name="case_model"
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Enter Case Model"
                                                        value={formData.case_model}
                                                        onChange={handleInputChange}
                                                    /> */}
                                                    <select className="custom-select" 
                                                        id="case_model"
                                                        name="case_model"
                                                        type="text"                                                        
                                                        placeholder="Enter Case Model"
                                                        value={formData.case_model}
                                                        onChange={handleInputChange}>
                                                        <option value="Criminal">Criminal</option>
                                                        <option value="Civil">Civil</option>
                                                        <option value="Labour">Labour</option>
                                                        <option value="Railways">Railways</option>
                                                        <option value="Consumer">Consumer</option>
                                                        <option value="Agent To Government">Agent To Government</option>
                                                        <option value="Other">Other</option>
                                                    </select>
                                                </div>
                                            </Form.Row>
                                            <Form.Row className="col-lg-12">
                                                <div className="form-group col-lg-6 float-left">
                                                <label htmlFor="court_name">Court Name</label>
                                                <input
                                                    id="court_name"
                                                    name="court_name"
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter Court name"
                                                    value={formData.court_name}
                                                    onChange={handleInputChange}
                                                />
                                                </div>

                                                <div className="form-group col-lg-6 float-left">
                                                <label htmlFor="opposition_name">Opposition Name</label>
                                                <input
                                                    id="opposition_name"
                                                    name="opposition_name"
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter Opposition name"
                                                    value={formData.opposition_name}
                                                    onChange={handleInputChange}
                                                />
                                                </div>
                                            </Form.Row>
                                            <Form.Row className="col-lg-12">
                                                <div className="form-group col-lg-6 float-left">
                                                <label htmlFor="registration_date">Registration Date</label>
                                                <input
                                                    id="registration_date"
                                                    name="registration_date"
                                                    type="date"
                                                    className="form-control"
                                                    placeholder="Registration Date"
                                                    value={formData.registration_date}                                                                                        
                                                    onChange={handleInputChange}
                                                />
                                                </div>
                                                <div className="form-group col-lg-6 float-left">
                                                <label htmlFor="adjourn_date">Adjourn Date</label>
                                                <input
                                                    id="adjourn_date"
                                                    name="adjourn_date"
                                                    type="date"
                                                    className="form-control"
                                                    placeholder="Flatpickr example"
                                                    data-toggle="flatpickr"
                                                    value={formData.adjourn_date}                                            
                                                    onChange={handleInputChange}
                                                />
                                                </div>
                                            </Form.Row>
                                            <div className="form-group col-lg-12">
                                                <label htmlFor="notes">Notes</label>
                                                <textarea
                                                id="notes"
                                                name="notes"
                                                rows="4"
                                                className="form-control"
                                                placeholder="Notes ..."
                                                value={formData.notes}
                                                onChange={handleInputChange}
                                                ></textarea>
                                            </div>
                                            </div>
                                        </div>
                                        </div>

                                        <div className="card card-form">
                                            <div className="row no-gutters">
                                                <div className="col-lg-4 card-body">
                                                    <p>
                                                        <strong className="headings-color">Upload Documents</strong>
                                                    </p>
                                                </div>
                                                <div className="col-lg-8 card-form__body card-body d-flex align-items-center">
                                                    <div className="dropzone dropzone-multiple w-100 dz-clickable">                                   
                                                        <div {...getRootProps({className: "dz-default dz-message",})}>
                                                            <input {...getInputProps()} />
                                                            <p className="m-0">Drop files here to upload</p>
                                                        </div>
                                                        <ul className="dz-preview dz-preview-multiple list-group list-group-flush mt-2">
                                                            {thumbnails}
                                                        </ul>                                
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    {/* </Form> */}
                                </div>
                            </Col>
                        </Row>
                    </Container>            
            </>
        )}
        no={() => <Redirect to={rules["default"][user_type]} />}
    />; 
};

export default EditPCM;