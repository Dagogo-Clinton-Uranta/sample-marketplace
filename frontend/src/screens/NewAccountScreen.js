import React, {useState ,useEffect} from 'react'

import {Link} from 'react-router-dom'
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import {Form, Button, Row, Col, ListGroup, ProgressBar,Alert} from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'


import Message from '../components/Message.js'
import Loader from '../components/Loader.js'
import {register} from '../actions/userActions.js'
import FormContainer from '../components/FormContainer.js'
import axios from 'axios'
// i'm using axios here cuz i'm sending info straight to formSubmit , no need to pass through any reducers and dispatchers 



const NewAccountScreen = ({location, history}) => { //he is taking location & history out of the props, normally it is props.location
   
   /*form info that I am gonna submit */
   const [formInfo,setFormInfo] = useState( JSON.parse(window.sessionStorage.getItem('formInfo')))
   
   /* I DIDNT DELETE THIS JUST YEST, IN CASE I NEED AN OBJECT LIKE THIS AGAIN
   useState({
    title: '',
    surname : '',
     middleName:'',
     firstName:'' ,
     stateOrigin:'',
     nationality:'',
     pob:'',
     dob:'',
     lga:'',
     gender:'',
     religion:'',
     resState:'',
     levelOfEd:'',
     educationSpecified:'',
     marriageStatus:'',
     marriageSpecified:'',
     email:'',
     'spouseName':spouseName,
      'maidenName':maidenName,
     flatNo:'',
     houseNo:'',
     streetName:'',
     town:'',
     tel:'',
     employmentType:'',
     employerName:'',
     businessType:'',
     salary:'',
     businessAddress:'',
     businessTel:'',
     businessEmail:'',
     idType:'',
     issuingAuthority:'',
     issuePlace:'',
     issueDate:'',
     expiryDate:''
   }) */
   
    
 

    const [title,setTitle] = useState(formInfo.title)
    
    const [surname,setSurname] = useState(formInfo.surname)
    const [middleName,setMiddlename] = useState(formInfo.middleName)
    const [firstName,setFirstName] = useState(formInfo.firstName)
    const [stateOrigin , setStateOrigin] = useState(formInfo.stateOrigin)
    const [nationality,setNationality] = useState(formInfo.nationality)
    const [pob,setPob] = useState(formInfo.pob)
    const [dob, setDob] = useState(formInfo.dob===''?formInfo.dob :new Date(formInfo.dob))
    console.log(dob) /*cuz of local storage you're passing dob is stored as a string when it's meant to be stored as a date */
    const [lga,setLga] = useState(formInfo.lga)
    const [gender,setGender] = useState(formInfo.gender)
    const [religion,setReligion] = useState(formInfo.religion)
    const [resState,setResState] = useState(formInfo.resState)
    const [levelOfEd,setLevelOfEd] = useState(formInfo.levelOfEd)
    const [educationSpecified, setEducationSpecified] = useState(formInfo.educationSpecified)
    const [marriageStatus ,setMarriageStatus] = useState(formInfo.marriageStatus)
    const [marriageSpecified,setMarriageSpecified] = useState(formInfo.marriageSpecified)
    const [spouseName,setSpouseName] = useState(formInfo.spouseName)
    const [maidenName,setmaidenName] = useState(formInfo.maidenName)
    const [email,setEmail] = useState(formInfo.email)
    const [flatNo,setFlatNo] = useState(formInfo.flatNo)
    const [houseNo,setHouseNo] = useState(formInfo.houseNo)
    const [streetName,setStreetName] = useState(formInfo.streetName)
    const [town,setTown] = useState(formInfo.town)
    const [tel,setTel] = useState(formInfo.tel)
    const [employmentType,setEmploymentType] = useState(formInfo.employmentType)
    const [employerName,setEmployerName] = useState(formInfo.employerName)
    const [businessType,setBusinessType] = useState(formInfo.businessType)
    const [salary,setSalary] = useState(formInfo.salary)
    const [businessAddress,setBusinessAddress] = useState(formInfo.businessAddress)
    const [businessTel,setBusinessTel] = useState(formInfo.businessTel)
    const [businessEmail,setBusinessEmail] = useState(formInfo.businessEmail)
    const [idType,setIdType] = useState(formInfo.idType)
    const [issuingAuthority,setIssuingAuthority] = useState(formInfo.issuingAuthority)
    const [issuePlace,setIssuePlace] = useState(formInfo.issuePlace)
    const [issueDate, setIssueDate] = useState(formInfo.issueDate===''?formInfo.issueDate :new Date(formInfo.issueDate))
    const [expiryDate, setExpiryDate] = useState(formInfo.expiryDate===''?formInfo.expiryDate :new Date(formInfo.expiryDate))
    
    /*form info ending */

   
     /*SUBMISSION PROCESSING*/
   const [submitted,setSubmitted] = useState(false)
   const [submitSuccess,setSubmitSuccess] = useState(false)
   const [submitFailure,setSubmitFailure] = useState(false)


/*SUBMISSION PROCESS ENDING */



 /*page regulation states */
 const [page1,setPage1] = useState(formInfo.page1)
 const [page2,setPage2] = useState(formInfo.page2)
 const [page3,setPage3] = useState(formInfo.page3)
 const [page4,setPage4] = useState(formInfo.page4)
 const [page5,setPage5] = useState(formInfo.page5)
 const [now ,setNow] =  useState(formInfo.now)
 /*page regulation states ending */


 
  const [message,setMessage] = useState(null)
  const dispatch = useDispatch() //dont forget that real dispatches only take place in action creators, you are only calling useDispatch here
  const userRegister = useSelector(state => state.userRegister);
  const {loading, error,userInfo } = userRegister
     
  const redirect = location.search ? location.search.split('=')[1]:'/'
//location .search has the url query string, study it a bit

//because we dont want to able to come into the login screen ONCE WE ARE ALREADY LOGGED IN, effect this in the useEffect below

  useEffect( () => {
    if(userInfo){ //cuz user info exists only when you're logged in
       history.push(redirect)
    }

    setFormInfo(JSON.parse(window.sessionStorage.getItem('formInfo')))
    console.log(dob)
  
  },[redirect,history,userInfo])


  useEffect( () => {
    

    window.sessionStorage.setItem('formInfo',JSON.stringify({
      'title': title,
      'surname' : surname,
       'middleName':middleName,
       'firstName':firstName ,
       'stateOrigin':stateOrigin,
       'nationality':nationality,
       'pob':pob,
       'dob':dob,
       'lga':lga,
       'gender':gender,
       'religion':religion,
       'resState':resState,
       'levelOfEd':levelOfEd,
       'educationSpecified':educationSpecified,
       'marriageStatus':marriageStatus,
       'marriageSpecified':marriageSpecified,
       'spouseName':spouseName,
       'maidenName':maidenName,
       'email':email,
       'flatNo':flatNo,
       'houseNo':houseNo,
       'streetName':streetName,
       'town':town,
       'tel':tel,
       'employmentType':employmentType,
       'employerName':employerName,
       'businessType':businessType,
       'salary':salary,
       'businessAddress':businessAddress,
       'businessTel':businessTel,
       'businessEmail':businessEmail,
       'idType':idType,
       'issuingAuthority':issuingAuthority,
       'issuePlace':issuePlace,
       'issueDate':issueDate,
       'expiryDate':expiryDate,
       'page1':page1,
       'page2':page2,
       'page3':page3,
       'page4':page4,
       'page5':page5,
       'now':now,
  
   
    }))
    
  
  },[formInfo,title,surname,middleName,firstName,stateOrigin,
    nationality,pob,dob,lga,gender,religion,resState,
    levelOfEd,educationSpecified,marriageStatus,marriageSpecified,
  email,flatNo,houseNo,streetName,town,tel,employmentType,employerName,
  businessType,salary,businessAddress,businessTel,businessEmail,idType,
  issuingAuthority,issuePlace,issueDate,expiryDate,page1,page2,page3,page4,page5
])





  const submitHandler = (e) => {
          e.preventDefault()
          if(title  ===''||surname ===''||middleName ===''||
          firstName ===''||stateOrigin ===''||nationality ===''||pob ===''||
          dob ===''||lga ===''||gender ===''||religion ===''||resState ===''||
            levelOfEd ===''||marriageStatus ===''||
            houseNo ===''||streetName ===''||town ===''||tel ===''||idType ===''||
          issuingAuthority ===''||issuePlace ===''||issueDate ===''||expiryDate=='')
          
          {
            window.alert('Please make sure all compulsory fields are filled in!')
            return;
          }
          else if(
                  employmentType !==''&&
                 (employerName ===''|| businessType ===''||salary ===''||businessAddress ===''||businessTel ===''||businessEmail ==='')
          ){
            window.alert('You selected a form of employment,make sure to fill all business related fields.')
            return;
          }
          else if(levelOfEd==="See Education Specified" && educationSpecified ===''){
            window.alert('please specify your education, as you have selected "Other" ')
            return;
          }
          else if(marriageStatus==="Other" && marriageSpecified ===''){
            window.alert('please specify your marriage situation, as you have selected "Other" ')
            return;
          }

          setSubmitted(true)
      
        axios.defaults.headers.post['Content-Type'] = 'application/json';
       axios.post('https://formsubmit.co/ajax/odubanjoadijat@bridgewaymfb.com', {
        
         'SUBJECT':`${title}-${surname} WOULD LIKE TO OPEN A NEW ACCOUNT CALL ${tel} TO CONFIRM`,
         'title': title,
         'surname' : surname,
         'middleName':middleName,
         'firstName':firstName ,
         'stateOrigin':stateOrigin,
         'nationality':nationality,
         'pob':pob,
         'dob':dob,
         'lga':lga,
         'gender':gender,
         'religion':religion,
         'resState':resState,
         'levelOfEd':levelOfEd,
         'educationSpecified':educationSpecified,
         'marriageStatus':marriageStatus,
         'marriageSpecified':marriageSpecified,
         'spouseName':spouseName,
         'maidenName':maidenName,
         'email':email,
         'flatNo':flatNo,
         'houseNo':houseNo,
         'streetName':streetName,
         'town':town,
         'tel':tel,
         'employmentType':employmentType,
         'employerName':employerName,
         'businessType':businessType,
         'Designation':salary,
         'businessAddress':businessAddress,
         'businessTel':businessTel,
         'businessEmail':businessEmail,
         'idType':idType,
         'issuingAuthority':issuingAuthority,
         'issuePlace':issuePlace,
         'issueDate':issueDate,
         'expiryDate':expiryDate,
         
   })
    .then(response =>{ console.log(response.data)
        if (response.data.success === 'true'){
          setSubmitSuccess(true)
          setSubmitted(false)
          setPage5(false)
          setNow(100)

      window.sessionStorage.setItem('formInfo',JSON.stringify({
        title: '',
        surname : '',
        middleName:'',
        firstName:'',
        stateOrigin:'',
        nationality:'',
        pob:'',
        dob:'',
        lga:'',
        gender:'',
        religion:'',
        resState:'',
        levelOfEd:'',
        educationSpecified:'',
        marriageStatus:'',
        marriageSpecified:'',
        email:'',
        flatNo:'',
        houseNo:'',
        streetName:'',
        town:'',
        tel:'',
        employmentType:'',
        employerName:'',
        businessType:'',
        salary:'',
        businessAddress:'',
        businessTel:'',
        businessEmail:'',
        idType:'',
        issuingAuthority:'',
        issuePlace:'',
        issueDate:'',
        expiryDate:'',
        page1:true,
        page2:false,
        page3:false,
        page4:false,
        page5:false,
        now:0
      
    }))
  }
    else if(response.data.success === 'false'){
    
      setSubmitted(false)
        setSubmitFailure(true)
          setPage5(false)

    }
       
     
  })
    
    .catch(error => console.log(error))
       

  }


/* PAGE HANDLER BUTTON SECTION */

  const page1Handler = () => {
    setPage1(true)
    setPage2(false)
    setPage3(false)
    setPage4(false)
    setPage5(false)
    setNow(0)
  } 

  const page2Handler = () => {
    setPage1(false)
    setPage2(true)
    setPage3(false)
    setPage4(false)
    setPage5(false)
    setNow(20)
  } 

  const page3Handler = () => {
    setPage1(false)
    setPage2(false)
    setPage3(true)
    setPage4(false)
    setPage5(false)
    setNow(40)
    
  } 


  const page4Handler = () => {
    setPage1(false)
    setPage2(false)
    setPage3(false)
    setPage4(true)
    setPage5(false)
    setNow(60)
    
    
  } 


  const page5Handler = () => {
    setPage1(false)
    setPage2(false)
    setPage3(false)
    setPage4(false)
    setPage5(true)
    setNow(80)
    setSubmitFailure(false)
     
  } 
 /* PAGE HANDLER BUTTON SECTION CLOSING */




    return (
       <FormContainer>
        
   
    
       <center> <h4>Open an Acount with Us !</h4> </center>
       
        
         
        <center className="progressMargin">PROGRESS:</center>  <ProgressBar  animated now={now} label={`${now}%`} className="Progressbar" />
        

        {loading && <Loader/>}
        <Form onSubmit={submitHandler}>

       { page1 &&

        <div className='sectionContainer'>
        <h6 className="boxTitles">Personal Info </h6>
    
     {/*1*/}      <Form.Group controlId='title'>


     <Form.Label>  Title <strong style={{color:"red"}}>*</strong></Form.Label>
         <Form.Control type='title' placeholder="Mr, Mrs, Dr, Miss etc..." value={title} onChange={(e)=>setTitle(e.target.value)}></Form.Control>
          {/*the value of form control is form control from the state.  need to read about form group from react bootstrap*/}
        </Form.Group>


  {/*2*/}      <Form.Group controlId='name'>

         <Form.Label>  Surname <strong style={{color:"red"}}>*</strong> </Form.Label>
         <Form.Control type='name' placeholder="enter surname" value={surname} onChange={(e)=>setSurname(e.target.value)}></Form.Control>
          {/*the value of form control is form control from the state.  need to read about form group from react bootstrap*/}
        </Form.Group>


{/*3*/}      <Form.Group controlId='name'>

     <Form.Label> Middle Name <strong style={{color:"red"}}>*</strong></Form.Label>
         <Form.Control type='name' placeholder="enter  middle name" value={middleName} onChange={(e)=>setMiddlename(e.target.value)}></Form.Control>
          {/*the value of form control is form control from the state.  need to read about form group from react bootstrap*/}
        </Form.Group>


{/*4*/}      <Form.Group controlId='name'>

       <Form.Label> First Name <strong style={{color:"red"}}>*</strong></Form.Label>
         <Form.Control type='name' placeholder="enter  first name" value={firstName} onChange={(e)=>setFirstName(e.target.value)}></Form.Control>
          {/*the value of form control is form control from the state.  need to read about form group from react bootstrap*/}
        </Form.Group>



{/*5*/}        <Form.Group controlId='dob'>

<Form.Label>  Date of Birth<strong style={{color:"red"}}>*</strong> </Form.Label>
           <div>start by entering the year</div>
          <DatePicker  dateFormat="dd-MM-yyyy" selected={dob==''?new Date():dob} onChange={(date) => setDob(date)}  />
          
           {/*the value of form control is form control from the state. need to read about form group from react bootstrap*/}
         </Form.Group>



{/*6*/}        <Form.Group controlId='pob'>

<Form.Label>  Place of Birth<strong style={{color:"red"}}>*</strong> </Form.Label>
          <Form.Control type='text' placeholder="enter the city and state of birth" value={pob} onChange={(e)=>setPob(e.target.value)}></Form.Control>
           {/*the value of form control is form control from the state. need to read about form group from react bootstrap*/}
         </Form.Group> 

        

    
       

{/*7*/}        <Form.Group controlId='nationality'>

         <Form.Label>  Nationality <strong style={{color:"red"}}>*</strong> </Form.Label>
          <Form.Control type='text' placeholder="Your nationality" value={nationality} onChange={(e)=>setNationality(e.target.value)}></Form.Control>
           {/*the value of form control is form control from the state. need to read about form group from react bootstrap*/}
         </Form.Group>    



         {/*8*/}        <Form.Group controlId='stateOrigin'>

          <Form.Label> State of Origin <strong style={{color:"red"}}>*</strong> </Form.Label>
          <Form.Control type='text' placeholder="Your state of origin" value={stateOrigin} onChange={(e)=>setStateOrigin(e.target.value)}></Form.Control>
           {/*the value of form control is form control from the state. need to read about form group from react bootstrap*/}
         </Form.Group>    
         <div className='buttonSpacer'>
         <Button type='button' variant='primary' onClick={page2Handler}>Next</Button>
         </div> 
       
         </div> 
         
         }   


         {/* page1 PERSONAL INFO ENDING*/} 
         
          {page2 &&
         <div className='sectionContainer'>
        <h6 className="boxTitles">Personal Info (2)</h6>
        
         {/*9*/}        <Form.Group controlId='lga'>

          <Form.Label>   Local Government Area<strong style={{color:"red"}}>*</strong> </Form.Label>
          <Form.Control type='text' placeholder="Enter your L.G.A" value={lga} onChange={(e)=>setLga(e.target.value)}></Form.Control>
           {/*the value of form control is form control from the state. need to read about form group from react bootstrap*/}
         </Form.Group>    




         <fieldset>
         {/*10*/}        <Form.Group controlId='gender'>

         <Form.Label>  Gender <strong style={{color:"red"}}>*</strong></Form.Label>
          <div className="mb-3"></div>
         <Form.Check inline type='radio' name='radiosInline' id='radiosInline1' label="Male" checked={gender==="Male"}  onChange={(e)=>setGender("Male")}/>
          <Form.Check inline type='radio' name='radiosInline' id='radiosInline2' label="Female" checked={gender==="Female"} onChange={(e)=>setGender("Female")}/>
           
         </Form.Group>
         </fieldset>


         {/*11*/}        <Form.Group controlId='religion'>

       <Form.Label>  Religion </Form.Label>
          <Form.Control type='text' placeholder="your Religion" value={religion} onChange={(e)=>setReligion(e.target.value)}></Form.Control>
           {/*the value of form control is form control from the state. need to read about form group from react bootstrap*/}
         </Form.Group>




         <fieldset>
         {/*12*/}        <Form.Group controlId='eductaionlevel'>

         <Form.Label>  Level of Education<strong style={{color:"red"}}>*</strong> </Form.Label>
          <div className="mb-3"></div>
         <Form.Check inline type='radio' name='radiosInline' id='radiosInline1' label="Primary" checked={levelOfEd ==="Primary"} onChange={(e)=>setLevelOfEd("Primary")}/>
          <Form.Check inline type='radio' name='radiosInline' id='radiosInline2' label="Secondary" checked={levelOfEd  ==="Secondary"} onChange={(e)=>setLevelOfEd("Secondary")}/>
          <Form.Check inline type='radio' name='radiosInline' id='radiosInline2' label="Other" checked={levelOfEd  ==="See Education Specified"} onChange={(e)=>setLevelOfEd("See Education Specified")}/>
         
          <Form.Control type='input' placeholder="level of education if you picked 'Other' " value={educationSpecified} onChange={(e)=>setEducationSpecified(e.target.value)}></Form.Control>
          
         </Form.Group>
         </fieldset>




         <fieldset>
         {/*13*/}        <Form.Group controlId='marriageStatus'>

         <Form.Label> Marital Status <strong style={{color:"red"}}>*</strong></Form.Label>
          <div className="mb-3"></div>
         <Form.Check inline type='radio' name='radiosInline' id='radiosInline1' label="Single" checked={marriageStatus ==="Single"} onChange={(e)=>setMarriageStatus("Single")}/>
          <Form.Check inline type='radio' name='radiosInline' id='radiosInline2' label="Married" checked={marriageStatus ==="Married"}  onChange={(e)=>setMarriageStatus("Married")}/>
          <Form.Check inline type='radio' name='radiosInline' id='radiosInline2' label="Divorced" checked={marriageStatus ==="Divorced"} onChange={(e)=>setMarriageStatus("Divorced")}/>
          <Form.Check inline type='radio' name='radiosInline' id='radiosInline2' label="Other" checked={marriageStatus ==="Other"} onChange={(e)=>setMarriageStatus("Other")}/>
          <Form.Control type='input' placeholder="Marital Status, if you picked 'Other' " value={marriageSpecified} onChange={(e)=>setMarriageSpecified(e.target.value)}></Form.Control>
         </Form.Group>
         </fieldset>


  {/*14*/}        <Form.Group controlId='spousename'>

          <Form.Label>  Spouse's Name (if married) </Form.Label>
          <Form.Control type='text' placeholder="enter spouse's name" value={spouseName} onChange={(e)=>setSpouseName(e.target.value)}></Form.Control>
           {/*the value of form control is form control from the state. need to read about form group from react bootstrap*/}
         </Form.Group>


         {/*15*/}        <Form.Group controlId='maidenname'>

         <Form.Label>  Mother's Maiden name <strong style={{color:"red"}}>*</strong>  </Form.Label>
          <Form.Control type='text' placeholder="mothers maiden name" value={maidenName} onChange={(e)=>setmaidenName(e.target.value)}></Form.Control>
           {/*the value of form control is form control from the state. need to read about form group from react bootstrap*/}
         </Form.Group>
          
          <div className='buttonSpacer'>
         <Button type='button' variant='primary' onClick={page1Handler} >Previous</Button>
          <Button type='button' variant='primary' onClick={page3Handler}>Next</Button>
          </div>

         </div> 
        }

        {/* page2  PERSONAL INFO 2 CLOSING TAG */}

        {page3 &&
        <div className='sectionContainer'>

        <h6 className="boxTitles">Residential Info</h6>

    {/*17*/}     <Form.Group controlId='flat number'>
        <Form.Label>  Flat Number </Form.Label>
          <Form.Control type='text' placeholder="flat number" value={flatNo} onChange={(e)=>setFlatNo(e.target.value)}></Form.Control>
           {/*the value of form control is form control from the state. need to read about form group from react bootstrap*/}
         </Form.Group>

    
 {/*18*/}         <Form.Group controlId='house number'>
        <Form.Label> House Number <strong style={{color:"red"}}>*</strong></Form.Label>
          <Form.Control type='text' placeholder="house number" value={houseNo} onChange={(e)=>setHouseNo(e.target.value)}></Form.Control>
           {/*the value of form control is form control from the state. need to read about form group from react bootstrap*/}
         </Form.Group>


 {/*19*/}       <Form.Group controlId='street name'>
        <Form.Label>  Street Name <strong style={{color:"red"}}>*</strong> </Form.Label>
          <Form.Control type='text' placeholder="the street you live on" value={streetName} onChange={(e)=>setStreetName(e.target.value)}></Form.Control>
          
         </Form.Group>


 {/*20*/}      <Form.Group controlId='town'>
        <Form.Label>  Town/City <strong style={{color:"red"}}>*</strong>  </Form.Label>
          <Form.Control type='text' placeholder="town/city name" value={town} onChange={(e)=>setTown(e.target.value)}></Form.Control>
           
         </Form.Group>


 {/*21*/}     <Form.Group controlId='state of residence'>
        <Form.Label>  State <strong style={{color:"red"}}>*</strong> </Form.Label>
          <Form.Control type='text' placeholder="state where you live" value={resState} onChange={(e)=>setResState(e.target.value)}></Form.Control>
           
         </Form.Group>


{/*22*/}     <Form.Group controlId='tel no'>
<Form.Label>  Telephone <strong style={{color:"red"}}>*</strong> </Form.Label>
          <Form.Control type='text' placeholder="telephone Number" value={tel} onChange={(e)=>setTel(e.target.value)}></Form.Control>
           
         </Form.Group>



{/*23*/}     <Form.Group controlId='email'>
  <Form.Label>  Email <strong style={{color:"red"}}>*</strong> </Form.Label>
      <Form.Control type='text' placeholder="email address" value={email} onChange={(e)=>setEmail(e.target.value)}></Form.Control>
           
         </Form.Group>


         <div className='buttonSpacer'>
         <Button type='button' variant='primary' onClick={page2Handler}>Previous</Button>
         <Button type='button' variant='primary' onClick={page4Handler}>Next</Button>
          </div>

        </div> 
            }
          {/*page 3 RESIDENTIAL INFO CLOSING TAG */}


         {/*page4 BUSINESS INFO*/}
          
          {page4 &&
        <div className='sectionContainer'>

        <h6 className="boxTitles">Business Info (If Applicable)</h6>

        <fieldset>
         {/*25*/}        <Form.Group controlId='worktype'>

         <Form.Label>  Nature of Employment <strong style={{color:"red"}}>*</strong> </Form.Label>
          <div className="mb-3"></div>
         <Form.Check inline type='radio' name='radiosInline' id='radiosInline1' label="Salaried"  checked = {employmentType === "Salaried"} onChange={(e)=>setEmploymentType("Salaried")}/>
          <Form.Check inline type='radio' name='radiosInline' id='radiosInline2' label="Self Employed" checked = {employmentType === "Self Employed"}  onChange={(e)=>setEmploymentType("Self Employed")}/>
          <Form.Check inline type='radio' name='radiosInline' id='radiosInline2' label="Other"  checked = {employmentType === "N/A"}  onChange={(e)=>{setEmploymentType("N/A"); setEmployerName('NONE')}}/>

         </Form.Group>
         </fieldset>
    
 {/*26*/}         <Form.Group controlId='employer name'>
        <Form.Label>  Employer's Name  </Form.Label>
          <Form.Control type='text' placeholder="fill in NONE if you dont have an employer" value={employerName} onChange={(e)=>setEmployerName(e.target.value)}></Form.Control>
           {/*the value of form control is form control from the state. need to read about form group from react bootstrap*/}
         </Form.Group>


 {/*27*/}       <Form.Group controlId='business sector'>
        <Form.Label>  Nature of Business  </Form.Label>
          <Form.Control type='text' placeholder="what industry are you in ?" value={businessType} onChange={(e)=>setBusinessType(e.target.value)}></Form.Control>
           {/*the value of form control is form control from the state. need to read about form group from react bootstrap*/}
         </Form.Group>


 {/*28*/}      <Form.Group controlId='Designation'>
        <Form.Label>  Designation </Form.Label>
          <Form.Control type='text' placeholder="monthly salary" value={salary} onChange={(e)=>setSalary(e.target.value)}></Form.Control>
           {/*the value of form control is form control from the state. need to read about form group from react bootstrap*/}
         </Form.Group>


 {/*29*/}     <Form.Group controlId='businessAddress'>
        <Form.Label>  Business Address  </Form.Label>
          <Form.Control type='text' placeholder="where is your office located at?" value={businessAddress} onChange={(e)=>setBusinessAddress(e.target.value)}></Form.Control>
           {/*the value of form control is form control from the state. need to read about form group from react bootstrap*/}
         </Form.Group>


    {/*30*/}     <Form.Group controlId='businessTel'>
        <Form.Label>  Business Telephone </Form.Label>
          <Form.Control type='text' placeholder="what if your office telephone line ?" value={businessTel} onChange={(e)=>setBusinessTel(e.target.value)}></Form.Control>
           {/*the value of form control is form control from the state. need to read about form group from react bootstrap*/}
         </Form.Group>


   {/*31*/}     <Form.Group controlId='businessEmail'>
   <Form.Label>  Business Email </Form.Label>
          <Form.Control type='text' placeholder="fill in if you have one " value={businessEmail} onChange={(e)=>setBusinessEmail(e.target.value)}></Form.Control>
           {/*the value of form control is form control from the state. need to read about form group from react bootstrap*/}
         </Form.Group>




         <div className='buttonSpacer'>
         <Button type='button' variant='primary' onClick={page3Handler}>Previous</Button>
         <Button type='button' variant='primary' onClick={page5Handler}>Next</Button>
          
         
          </div>

        </div> 
            }


          {/*page 4 RESIDENTIAL INFO CLOSING TAG */}
      
       
       {/*page 5 ID CARD INFO */}



       {page5 &&
        <div className='sectionContainer'>

        <h6 className="boxTitles">ID card Info</h6>

        <fieldset>
         {/*32*/}        <Form.Group controlId='worktype'>

         <Form.Label>  Type of Identification <strong style={{color:"red"}}>*</strong> </Form.Label>
         {/*<div style={{color=grey }}>Please note:If you have an ID different from the ones listed below ,you will have to come to our physical branch for verification</div>*/}
          
          <div className="mb-3"></div>
         <Form.Check inline type='radio' name='radiosInline' id='radiosInline1' label="Int'l Passport" checked = {idType === "international Passport"}  onChange={(e)=>setIdType("international Passport")}/>
          <Form.Check inline type='radio' name='radiosInline' id='radiosInline2' label="Driver's License" checked = {idType === "Driver's license"} onChange={(e)=>setIdType("Driver's license")}/>
          <Form.Check inline type='radio' name='radiosInline' id='radiosInline3' label="National ID" checked = {idType === "National ID"} onChange={(e)=>{setIdType("National ID") }}/>
          <Form.Check inline type='radio' name='radiosInline' id='radiosInline4' label="Voter's Card" checked = {idType === "Voter's Card"} onChange={(e)=>{setIdType("Voter's Card") }}/>
         </Form.Group>
         </fieldset>
    
 {/*33*/}         <Form.Group controlId='issuing authority'>
        <Form.Label>   Issuing Authority <strong style={{color:"red"}}>*</strong> </Form.Label>
          <Form.Control type='text' placeholder="who issued this ID to you" value={issuingAuthority} onChange={(e)=>setIssuingAuthority(e.target.value)}></Form.Control>
           {/*the value of form control is form control from the state. need to read about form group from react bootstrap*/}
         </Form.Group>


 {/*34*/}       <Form.Group controlId='place of issue'>
        <Form.Label>  Place of Issue <strong style={{color:"red"}}>*</strong> </Form.Label>
          <Form.Control type='text' placeholder="where were you issued this ID ?" value={issuePlace} onChange={(e)=>setIssuePlace(e.target.value)}></Form.Control>
           {/*the value of form control is form control from the state. need to read about form group from react bootstrap*/}
         </Form.Group>




  {/*35*/}     <Form.Group controlId='businessAddress'>
        <Form.Label>  Issue Date <strong style={{color:"red"}}>*</strong>  </Form.Label>
         <DatePicker dateFormat="dd-MM-yyyy" selected={issueDate===''?new Date():issueDate} onChange={(date) => setIssueDate(date)} />
         </Form.Group>



  {/*36*/}        <Form.Group controlId='businessAddress'>
        <Form.Label>  Expiry Date <strong style={{color:"red"}}>*</strong> </Form.Label>
         <DatePicker dateFormat="dd-MM-yyyy" selected={expiryDate===''?new Date():expiryDate} onChange={(date) => setExpiryDate(date)} />
         </Form.Group>


         <div className='buttonSpacer'>
        {!submitted && <Button type='button' variant='primary' onClick={page4Handler}>Previous</Button>}
         {!submitted && <Button type='submit' variant='primary'>Submit</Button>}
         {submitted && <Loader/>}
         
          </div>

        </div> 
            }

       {/*page 5 ID CARD INFO closing tag*/}



        </Form>




       {submitSuccess && <Alert variant="success">
  <Alert.Heading>Successful Submission</Alert.Heading>
  <p>
    Congratulations! We have succesfully recieved your information and have begun the process of creating 
    an account for you. Expect a confirmatory call from us.
  </p>
  <hr />
  <p className="mb-0">
    Please check back within 24 hours, to see if you are able to use the co-operative.
  </p>

  <div className='buttonSpacer'>
     <Link to={'/'}> <Button type='button' variant='primary' >Home Page</Button></Link>
         
         <Button type='button' variant='primary' onClick={page1Handler}>Create Another Account</Button>
  </div>
</Alert> } 


      {submitFailure && <Alert variant="danger">
      <Alert.Heading>Submission Error</Alert.Heading>
  <p>
    Please Check your internet connection and try again!
  </p>
  <hr />
  <p className="mb-0">
    Don't worry, you won't have to fill the form again, just click try again.
  </p>

  <div className='buttonSpacer'>
  <Button type='button' variant='primary' onClick={page5Handler}>Try Again</Button>
     <Link to={'/'}> <Button type='button' variant='primary' >Home Page</Button></Link>
         
         
  </div>
</Alert> }




        <Row className='py-3'>
         <Col>
           Have an account?<Link to={/*redirect?`$login/redirect=${redirect}`:*/'/login'}> Login</Link>
         </Col>
        </Row>

       </FormContainer>

    )

}

export default NewAccountScreen
