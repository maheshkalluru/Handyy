import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col, Breadcrumb, Image, Form, Button, Toast } from "react-bootstrap";
import { Home, Close } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { AddPCMdata, UploadDocument, GetPCMDetails } from '../../../Services/pcm-service';
import { GetCurrentUserAdvocateId } from '../../../Services/common-service';
import { useParams } from "react-router-dom";
import Can from "../../Can";
import rules from "../../../../rbac-rules";
import { Redirect } from "react-router-dom";
import { GetCurrentUser } from '../../../Services/common-service';

const initialPCMFormData = {
    name: "",
    phone: "",
    address: "",
    district: "",
    state: "",
    country: "",
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

const UpdatePCM = (props) => {

    let { case_number } = useParams();
    const advocate_id = GetCurrentUserAdvocateId();
    const [formData, updateFormData] = React.useState(initialPCMFormData);
    const [files, setFiles] = useState([]);
    const userDetails = GetCurrentUser();
    const user_type = userDetails != null ? userDetails.user_type : "";

    const pcmData = useCallback(() => {
        GetPCMDetails(advocate_id, case_number).then(data => {
            // console.log(data);
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
        });
    }, [])

    useEffect(() => {
        // console.log("inside edit-pcms useEffect...");
        pcmData();               
    }, [pcmData]);

    // form data handling

    const handleInputChange = (event) => {
        // console.log(event);
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
        AddPCMdata(data).then(status => {
            // console.log('idhr aaya...');
            if(status === "200"){
                // console.log('success ho gya...');
                updateFormData({...initialPCMFormData});
            }else{
                // console.log('error');
            }
        });
    };

    // drop-zone for file handling

    useEffect(() => {        
        // Make sure to revoke the data uris to avoid memory leaks
        console.log("inside edit-pcms  filese...");               
        files.forEach(file => URL.revokeObjectURL(file.preview));
    }, [files]);   

    const {getRootProps, getInputProps } = useDropzone({
        accept: 'image/*,.pdf,.doc,.docx',
        onDrop: (acceptedFiles) => {
            acceptedFiles.map(file => {
                const reader = new FileReader();
                reader.onabort = () => console.log('file reading was aborted')
                reader.onerror = () => console.log('file reading has failed')
                reader.onload = () => {
                // Do whatever you want with the file contents
                    const binaryStr = reader.result                    
                    const base64Str = btoa(binaryStr);                    
                    const obj = {
                        case_num: formData.case_num,
                        advocate_id: advocate_id,
                        doc: base64Str,
                        doc_name: file.name
                    }
                    UploadDocument(obj).then(status => {
                        // console.log(status);
                    });
                }
                reader.readAsBinaryString(file)
            });
            
            setFiles(acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            })));
        },
        multiple: true
    });
     
    const thumbnails = files.map((file, i) => (       
        
        <li className="list-group-item" key={file.name}>
            <div className="form-row align-items-center">
                <div className="col-auto">
                    <div className="avatar">
                        <Image src={file.preview} className="avatar-img rounded" alt={file.name}></Image>        
                    </div>
                </div>
                <div className="col">
                    <div className="font-weight-bold" data-dz-name>{file.name}</div>
                    <p className="small text-muted mb-0" data-dz-size>
                        <strong>{(file.size / 1000).toFixed(2)}</strong> KB
                    </p>
                </div>
                <div className="col-auto">
                    <span className="text-muted-light" onClick={() => remove(i)} data-dz-remove>
                        <Close></Close>
                    </span>
                </div>
            </div>
        </li>
    ));

    const remove = file => {
        // console.log(file);
        const newFiles = [...files];     // make a var for the new array
        newFiles.splice(file, 1);        // remove the file from the array
        setFiles(newFiles);
    };        

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
                                <Button className="btn btn-success ml-1" onClick={handleSubmit}>Save</Button>
                                <Link to="/pcm" className="btn btn-light ml-1">Cancel</Link>
                            </div>
                        </Row>
                    </Container>
                    <Container fluid style={{ paddingTop: "18px" }}>
                        <Row>
                            <Col lg={12} className="p-0 mt-2">
                                <div className="container-fluid page__container">
                                    <Form>
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
                                                    className="form-control"
                                                    placeholder="Full name"
                                                    name="name"
                                                    value={formData.name}                                            
                                                    onChange={handleInputChange}
                                                />
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
                                                    onChange={handleInputChange}
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
                                                    <select
                                                    id="district"
                                                    name="district"
                                                    className="custom-select"
                                                    style={{ width: "auto" }}
                                                    value={formData.district}  
                                                    onChange={handleInputChange}
                                                    >
                                                    <option value="usa">Hyderabad</option>
                                                    </select>
                                                </div>
                                                <div className="form-group col-md-3 float-left">
                                                    <label htmlFor="state">State</label>
                                                    <br />
                                                    <select
                                                    id="state"
                                                    name="state"
                                                    className="custom-select"
                                                    style={{ width: "auto" }}
                                                    value={formData.state}  
                                                    onChange={handleInputChange}
                                                    >
                                                    <option value="usa">Telangana</option>
                                                    </select>
                                                </div>
                                                <div className="form-group col-md-3 float-left">
                                                    <label htmlFor="country">Country</label>
                                                    <br />
                                                    <select
                                                    id="country"
                                                    name="country"
                                                    className="custom-select"
                                                    style={{ width: "auto" }}
                                                    value={formData.country}
                                                    onChange={handleInputChange}
                                                    >
                                                    <option value="usa">India</option>
                                                    </select>
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
                                                    className="form-control"
                                                    placeholder="Enter Case Number"
                                                    value={formData.case_num}
                                                    onChange={handleInputChange}
                                                />
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
                                                {/* <select id="country" className="custom-select">
                                                                            <option value="usa">Criminal</option>
                                                                            <option value="usa">Civil</option>
                                                                        </select> */}
                                                </div>
                                                <div className="form-group col-lg-4 float-left">
                                                <label htmlFor="case_model">Case Model</label>
                                                <br />
                                                <input
                                                    id="case_model"
                                                    name="case_model"
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter Case Model"
                                                    value={formData.case_model}
                                                    onChange={handleInputChange}
                                                />
                                                {/* <select id="country" className="custom-select">
                                                                            <option value="usa">Criminal</option>
                                                                            <option value="usa">Civil</option>
                                                                        </select> */}
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
                                    </Form>
                                </div>
                            </Col>
                        </Row>
                    </Container>            
        </>
        )}
        no={() => <Redirect to={rules["default"][user_type]} />}
    />; 
};

export default UpdatePCM;
