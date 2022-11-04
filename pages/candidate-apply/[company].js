// import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react';
import ErrorPage from 'next/error'
import Image from 'next/image'
import CandidateForm from '../../components/candidateform'
import { getBranchOpenings, getCompany } from '../../components/preRender';


export default function Apply({ err, openings, company }) {
    if (err) {
        return <ErrorPage statusCode={err.statusCode} />
    } else {
        return (
            <div>
                <div className='form-wrapper'>
                    <div className='logoContainer'>
                        <Image
                            src={company['image']}
                            alt={company['name']}
                            layout="fill"
                            objectFit='contain'

                        />
                    </div>
                    <h2 style={{ textAlign: 'center' }}>Candidate Registration Form</h2>
                    <div>
                        <CandidateForm openings={openings['branches']} company={company} />
                    </div>
                </div>
                <div style={{ paddingBottom: '20px' }}>
                    <p style={{ textAlign: 'center', margin: '0' }}>Powered By</p>
                    <div className='incuseLogo'>
                        <Image
                            src='/ihr_logo.png'
                            alt='incuse logo'
                            layout="fill"
                            objectFit='contain'

                        />
                    </div>
                </div>
            </div>
        )
    }

}


export async function getServerSideProps(context) {
    const companyId = context.params.company
    const company = await getCompany(companyId)
    if (company == undefined) {
        return {
            props: {
                err: { statusCode: 404 }
            }
        }
    }
    else {
        var openings = await getBranchOpenings(company)
        if (openings.hasOwnProperty('err')) {
            return {
                props: {
                    err: { statusCode: 503 }
                }
            }
        } else {
            return {
                props: {
                    openings,
                    company,
                },
            };
        }
    }
}