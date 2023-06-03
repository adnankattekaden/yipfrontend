
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import { CustomSelect } from '../../../../../components/CustomSelect/CustomSelect'
import { selectProps } from '../../../../utils/setupUtils'
import { fetchStatus } from '../../../School/SchoolAPI'
import ConnectionModal from '../Connection/ConnectionModal'
import './CampusModal.scss'
import Orientation from '../Orientation/Orientation'
import OrientationScheduleModal from '../Orientation/OrientationScheduleModal'
import OrientationCompletedModal from '../Orientation/OrientationCompletedModal'
import ExecomModal from '../Execom/ExecomModal'
import { privateGateway } from '../../../../../../../services/apiGateway'
import { tableRoutes } from '../../../../../../../services/urls'
const CampusModal = ({ campuStatus, campusId, cancel, district, eventId }: { campuStatus: string, campusId: string, cancel: () => void, district?: string, eventId?: string }) => {
    console.log(district)
    const [statusList, setStatusList] = useState<string[]>([])
    const [optionStatusList, setOptionStatusList] = useState<selectProps[]>([])
    const [status, setStatus] = useState<string>('')
    const viewConnection = (status === 'Connection Established') || (campuStatus === 'Confirmed' && status === '')
    const viewScheduled = (status === 'Orientation Scheduled') || (campuStatus === 'Connection Established' && status === '')
    const viewCompleted = (status === 'Orientation Completed') || (campuStatus === 'Orientation Scheduled' && status === '')
    const viewExecom = (status === 'Execom Formed') || (campuStatus === 'Orientation Completed' && status === '') || (campuStatus === 'Execom Formed' && status === '')
    const viewUpdateButton = (status === 'Confirmed') || (campuStatus === 'Identified' && status === '') || (status === 'Identified')
    useEffect(() => {
        fetchStatus(setStatusList, setOptionStatusList)
        if (campuStatus === 'Identified') {
            setStatus('Confirmed')
        }
    }, [])
    return (
        <div className="modal-overlay">
            <div className='modal'>
                <div className='heading'>
                    <div className="title">Update Status</div>
                    <div className="close-btn" onClick={cancel}><i className="fa fa-close"></i>
                    </div>
                </div>
                <div className='secondary-box'>
                    <div className="data-box">
                        <div className="content">
                            <CustomSelect
                                option={optionStatusList}
                                header='Status'
                                setValue={setStatus}
                                requiredHeader={false}
                                requiredData={false}
                                isClearable={false}
                                requiredLabel={true}
                                placeholder={getNextStatus(campuStatus)}
                                requirePlaceHolder={true}
                                customCSS={{
                                    className: "react-select-container",
                                    classNamePrefix: "react-select"
                                }
                                }
                            />
                        </div>
                    </div>
                    {viewConnection && <ConnectionModal cancel={cancel} campusId={campusId as string} />}
                    {viewScheduled && <OrientationScheduleModal cancel={cancel} district={district as string} campusId={campusId} />}
                    {viewCompleted && <OrientationCompletedModal cancel={cancel} eventId={eventId as string} />}
                    {viewExecom && <ExecomModal cancel={cancel} campusId={campusId} />}
                </div>

                {viewUpdateButton &&
                    <div className='secondary-box'>
                        <div className={`${(status && status !== campuStatus) ? 'btn-update ' : 'btn-disabled'}`}
                            onClick={() => { if (status && status !== campuStatus) updateStatus(campusId as string, status, cancel) }}>
                            Update Status
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}
function updateStatus(id: string, status: string, cancel: () => void) {
    privateGateway.put(tableRoutes.status.update, { clubId: id, clubStatus: status })
        .then(res => {
            cancel()
            console.log('Success :', res?.data?.message?.general[0])
        })
        .catch(err => console.error(err))
}
function getNextStatus(status: string) {
    switch (status) {
        case 'Identified': return 'Confirmed'
        case 'Confirmed': return 'Connection Established'
        case 'Connection Established': return 'Orientation Scheduled'
        case 'Orientation Scheduled': return 'Orientation Completed'
        case 'Orientation Completed': return 'Execom Formed'
        case 'Execom Formed': return 'Execom Formed'
        default: return ''
    }
}
export default CampusModal