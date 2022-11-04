import React, { useEffect, useState } from 'react';
import titleize from 'titleize';
import { useForm } from 'react-hook-form';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ClipLoader from "react-spinners/ClipLoader";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Schema for form handling
const schema = yup.object().shape({
    firstName: yup.string().required('Please enter your first name.'),
    lastName: yup.string().required('Please enter your last name.'),
    branch: yup.string().required('Please select a branc.'),
    city: yup.string().required('Please enter a city.'),
    skills: yup.string().required('Please select a skills.'),
    opening: yup.string().required('Please select a opening.'),
    gender: yup.string().required('Please select an option.'),
    education: yup.string().required('Please select an option.'),
    experience: yup.number().required('Please enter a valid number.').min(0, 'Please enter a valid number.').typeError('Please enter a valid number.'),
    currentCTC: yup.number().required('Please enter a valid number.').min(0, 'Please enter a valid number.').typeError('Please enter a valid number.'),
    expectedCTC: yup.number().required('Please enter a valid number.').min(0, 'Please enter a valid number.').typeError('Please enter a valid number.'),
    email: yup.string().email().required('Please enter valid email.'),
    number: yup.number('Please enter a valid phone number.').required().min(0, 'Please enter a valid phone number.').typeError('Please enter a valid phone number.')
        .test('length', 'Not a valid phone number.', (value) => { return value && value.toString().length == 10 }),
    candidatePic: yup.mixed()
        .test('required', "You need to provide a file!", (value) => {
            return value && value.length
        })
        .test("fileSize", "The file is too large!", (value, context) => {
            return value && value[0] && value[0].size <= 3000000;
        }),
    resume: yup.mixed()
        .test('required', "You need to provide a file!", (value) => {
            return value && value.length
        })
        .test("fileSize", "The file is too large!", (value, context) => {
            return value && value[0] && value[0].size <= 1000000;
        })
});

export default function CandidateForm({ openings, company }) {
    const { register, watch, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema), mode: 'all',
        reValidateMode: 'onChange'
    });
    const [imageName, setImageName] = useState('')
    const [branchOpenings, setBranchOpenings] = useState([])
    const [loading, setLoading] = useState(false);
    // Function to set openings drop down based on branch selected.
    const handleBranch = (e) => {
        for (const obj of openings) {
            if (obj.id == e.target.value) {
                var jobs = obj['openings'];
                setBranchOpenings(jobs);
            }
        }
    }
    const onSubmit = async data => {
        var info = data
        // Adding false for backend reasons.
        info['submitted'] = false
        info['companyName'] = company['id']
        setLoading(true);
        // Converting files to base64.
        var imageReader = new FileReader();
        var reportReader = new FileReader();
        imageReader.readAsDataURL(data.candidatePic[0]);
        imageReader.onload = function () {
            // Removing the meta data and extracting only bytes data as base64.
            info.candidatePic = imageReader.result.split(',')[1];
            reportReader.readAsDataURL(data.resume[0]);
            reportReader.onload = function () {
                info.resume = reportReader.result.split(',')[1];
                // Posting the JSON.
                fetch("/api/candidate", {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(info)
                }).then((res) => res.json()
                ).then(json => {
                    console.log(json)
                    if (json.hasOwnProperty('err')) {
                        setLoading(false);
                        toast('Submission Failed!', {
                            position: toast.POSITION.TOP_RIGHT,
                            type: toast.TYPE.ERROR,
                            autoClose: 1500,
                            closeOnClick: true,
                            pauseOnHover: false
                        });
                        // reset();
                    } else {
                        setLoading(false);
                        toast("Submitted!", {
                            position: toast.POSITION.TOP_RIGHT,
                            type: toast.TYPE.SUCCESS,
                            autoClose: 1500,
                            closeOnClick: true,
                            pauseOnHover: false
                        });
                        reset();
                    }

                })
            };

        };
    };

    return (
        <>
            <form className='formHandler' onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>Job Location:</label>
                    <select {...register('branch')} className={errors.branch && "error"} onChange={(e) => handleBranch(e)}>
                        <option value=""></option>
                        {openings.map(branch => {
                            if (branch.hasOwnProperty('openings')) {
                                return <option key={branch['id']} value={branch['id']}>{titleize(branch['name'])}</option>
                            }
                        })}
                    </select>
                    <span>{errors.branch && errors.branch.message}</span>

                </div>
                <div>
                    <label>Opening:</label>
                    <select {...register('opening')} className={errors.opening && "error"}>
                        <option value=""></option>
                        {branchOpenings.length == 0 ? <option value=""></option> :
                            branchOpenings.map(job => {
                                return <option key={job['id']} value={job['id']}>{titleize(job['job_title'])}</option>
                            })
                        }
                    </select>
                    <span>{errors.opening && errors.opening.message}</span>
                </div>
                <div>
                    <label>First Name</label>
                    <input type="text" {...register("firstName")} className={errors.firstName && "error"} />
                    <span>{errors.firstName && errors.firstName.message}</span>

                </div>
                <div>
                    <label>Last Name</label>
                    <input type="text" {...register("lastName")} className={errors.lastName && "error"} />
                    <span>{errors.lastName && errors.lastName.message}</span>
                </div>


                <div>
                    <label>Email</label>
                    <input type="email" {...register('email')} className={errors.email && "error"} />
                    <span>{errors.email && errors.email.message}</span>
                </div>
                <div>
                    <label>Contact Number</label>
                    <input type="number" {...register('number')} className={errors.number && "error"} />
                    <span>{errors.number && errors.number.message}</span>
                </div>
                <div>
                    <label>Gender:</label>
                    <select className={errors.gender && "error"} {...register('gender')}>
                        <option value=""></option>
                        <option value="1">Male</option>
                        <option value="2">Female</option>
                        <option value="3">Others</option>
                    </select>
                    <span>{errors.gender && errors.gender.message}</span>
                </div>
                <div>
                    <label>Education</label>
                    <select className={errors.education && "error"} {...register('education')}>
                        <option value=""></option>
                        <option value="Primary Education">Primary Education</option>
                        <option value="Secondary Education or High School">Secondary Education or High School</option>
                        <option value="Bachelor's Degree">Bachelor&apos;s Degree</option>
                        <option value="Master's Degree">Master&apos;s Degree</option>
                        <option value="Diploma">Diploma</option>
                        <option value="Others">Others</option>
                    </select>
                    <span>{errors.education && errors.education.message}</span>

                </div>
                <div>
                    <label>City</label>
                    <input type="text" {...register("city")} className={errors.city && "error"} />
                    <span>{errors.city && errors.city.message}</span>

                </div>
                <div>
                    <label>Experience (In Years)</label>
                    <input type="number" {...register('experience')} className={errors.experience && "error"} />
                    <span>{errors.experience && errors.experience.message}</span>
                </div>
                <div>
                    <label>Current CTC (In Lakhs)</label>
                    <input type="number" step="0.1" {...register('currentCTC')} className={errors.currentCTC && "error"} />
                    <span>{errors.currentCTC && errors.currentCTC.message}</span>
                </div>
                <div>
                    <label>Expected CTC (In Lakhs)</label>
                    <input type="number" step="0.1" {...register('expectedCTC')} className={errors.expectedCTC && "error"} />
                    <span>{errors.expectedCTC && errors.expectedCTC.message}</span>
                </div>
                <div>
                    <label>Skills</label>
                    <input type="text" {...register("skills")} className={errors.skills && "error"} />
                    <span>{errors.skills && errors.skills.message}</span>
                </div>
                <div></div>
                <div>
                    <label style={{ paddingBottom: '10px', display: 'block' }}>Upload Profile Image</label>
                    <input type="file" accept="image/*" {...register("candidatePic")} />
                    <span>{errors.candidatePic && errors.candidatePic.message}</span>
                </div>


                <div>
                    <label style={{ paddingBottom: '10px', display: 'block' }}>Resume (pdf/image)</label>
                    <input type="file" accept="image/*,application/pdf" {...register("resume")} />
                    <span>{errors.resume && errors.resume.message}</span>
                </div>
                <div style={{ textAlign: 'center' }}>
                    {loading ?
                        <ClipLoader color='#2f67e9' /> :
                        <input type="submit" />}
                </div>

            </form>
            <ToastContainer />
        </>
    );
}