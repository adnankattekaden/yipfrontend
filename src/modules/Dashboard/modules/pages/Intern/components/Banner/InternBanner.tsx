import React, { useState, useEffect, Dispatch, SetStateAction } from 'react'
import { CustomSelect } from '../../../../../components/CustomSelect/CustomSelect'
import './InternBanner.scss'
import { privateGateway } from '../../../../../../../services/apiGateway'
import { campusRoutes, yip5Routes } from '../../../../../../../services/urls'
import { selectProps } from '../../../../utils/setupUtils'
const InternBanner = ({ update }: { update: boolean }) => {
    const [banner, setBanner] = useState<any>({})
    const [district, setDistrict] = useState<selectProps>({} as selectProps)
    const [districtList, setDistrictList] = useState<selectProps[]>([])
    const [zone, setZone] = useState<selectProps>({} as selectProps)
    const [zoneList, setZoneList] = useState<selectProps[]>([])
    const [college, setCollege] = useState<selectProps>({} as selectProps)
    const [collegeList, setCollegeList] = useState<selectProps[]>([])
    useEffect(() => {
        fetchZone(setZoneList)
        fetchBannerData(setBanner as any, 'state', 'state')
    }, [])
    useEffect(() => {
        if (zone.id) {
            fetchDistricts(zone.name, setDistrictList)
            fetchBannerData(setBanner as any, 'zone', zone.name)
        }
        else {
            fetchBannerData(setBanner as any, 'state', 'state')
        }
        setDistrict({} as selectProps)
        setCollege({} as selectProps)
    }, [zone, update])

    useEffect(() => {
        if (district.id) {
            fetchCollege(district.name, setCollegeList)
            fetchBannerData(setBanner as any, 'district', district.name)
        }
        else {
            if (zone.id) {
                fetchBannerData(setBanner as any, 'zone', zone.name)
            }
        }
        setCollege({} as selectProps)
    }, [district, update])

    useEffect(() => {
        if (college.id) {
            fetchBannerData(setBanner as any, 'institute', college.id)
        }
        else {
            if (district.id) {
                fetchBannerData(setBanner as any, 'district', district.name)
            }
        }
    }, [college, update])



    return (
        <div className='white-container'>
            <div className='banner-header'>
                <p>{showCurrentSelected(zone, district, college)}</p>
                <p className='last-updated'>Last Updated : {formatDate(banner.last_update_date)}</p>
            </div>
            <div className="filter-container">

                <div className="filter-box">
                    {/* TODO: Clear Concurrent Values, if parent is altered */}
                    <CustomSelect
                        option={zoneList}
                        header={'Zone'}
                        requiredHeader={false}
                        setData={setZone}
                        data={zone}
                        value={zoneList.filter(zoneList => zoneList?.name !== "" && zoneList?.id === zone?.id)}
                    />
                    {zone.id && <CustomSelect
                        option={districtList}
                        header={'District'}
                        requiredHeader={false}
                        setData={setDistrict}
                        data={district}
                        value={districtList.filter(districtList => districtList?.name !== "" && districtList?.id === district?.id)}
                    />}
                    {district.id && <CustomSelect
                        option={collegeList}
                        header={'College'}
                        requiredHeader={false}
                        setData={setCollege}
                        data={college}
                        value={collegeList.filter(collegeList => collegeList?.name !== "" && collegeList?.id === college?.id)}
                    />}
                </div >
            </div>

            <div className="statistics">
                {/* <div className={`box blue-box`} >
                    <h3>{100}<div className="count"><div className="count-in">{ }</div></div></h3>
                    <p>Total Strength</p>
                </div> */}
                <div className={`box blue-box`} >
                    <h3>{banner.preRegistration}<div className="count"><div className="count-in">{ }</div></div></h3>
                    <p>{'Pre-registrations'}</p>

                </div>
                <div className={`box blue-box`} >
                    <h3>{banner.vos}<div className="count"><div className="count-in">{ }</div></div></h3>
                    <p>{'VOS Completed'}</p>
                </div>
                <div className={`box blue-box`} >
                    <h3>{banner.groupFormation} <div className="count"><div className="count-in">{ }</div></div></h3>
                    <p>{'Group Formations'}</p>
                </div>
                <div className={`box blue-box`} >
                    <h3>{banner.ideaSubmission}<div className="count"><div className="count-in">{ }</div></div></h3>
                    <p>{'Idea Submissions'}</p>
                </div>
                <div className={`box blue-box color-change`} >
                    <h3>{banner && Number.isNaN(Math.round(banner.vos / banner.preRegistration * 100)) ? 0 : Math.round(banner.vos / banner.preRegistration * 100)}%<div className="count"><div className="count-in">{ }</div></div></h3>
                    <p>{'Pre-registration to VOS '}</p>
                </div>
                <div className={`box blue-box color-change`} >
                    <h3>{banner && Number.isNaN(Math.round(banner.vos / banner.groupFormation * 100)) ? 0 : Math.round(banner.ideaSubmission / banner.groupFormation * 100)}%<div className="count"><div className="count-in">{ }</div></div></h3>
                    <p>{'Group Formation to Idea Submission '}</p>
                </div>
            </div>
        </div>
    )
}

export default InternBanner

function showDecimal(num: number) {
    var decimalPart = parseFloat(num.toFixed(2));
    return decimalPart;
}
function fetchBannerData(setBanner: Dispatch<SetStateAction<any>>, type: string, value: string) {
    let url = ''
    if (type !== 'state')
        url = `?${type}=${value}`
    privateGateway.get(`${yip5Routes.bannerData}${url}`)
        .then((res: any) => {
            setBanner(res.data.response)
        })
        .catch((err: any) => {
            console.log(err)
        })
}
function fetchZone(setData: Dispatch<SetStateAction<selectProps[]>>) {
    privateGateway.get(yip5Routes.zoneList)
        .then(res => setData(res.data.response))
        .catch(err => console.log(err))
}
function fetchDistricts(zone: string, setData: Dispatch<SetStateAction<selectProps[]>>) {
    privateGateway.get(`${campusRoutes.listDistrict}${zone}/`)
        .then(res => {
            setData(res.data.response.districts)
        })
        .catch(err => console.log(err))
}
function fetchCollege(district: string, setData: Dispatch<SetStateAction<selectProps[]>>) {
    privateGateway.get(`${campusRoutes.listInstitutes}${district}/`)
        .then(res => setData(res.data.response.map((item: any) => ({
            id: item.id,
            name: item.name
        }))))
        .catch(err => console.log(err))
}
function showCurrentSelected(zone: selectProps, district: selectProps, college: selectProps): React.ReactNode {
    if (college.id) {
        return `${college.name}`
    }
    else if (district.id) {
        return `${district.name} District`
    }
    else if (zone.id) {
        return `${zone.name} Zone`
    }
    else {
        return 'Kerala'
    }
}
function formatDate(dateTimeString: string): string {
    if (dateTimeString === null) return ''
    const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    };
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', options);
}