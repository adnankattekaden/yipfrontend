import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { CustomSelect } from '../../../../../components/CustomSelect/CustomSelect'
import { privateGateway } from '../../../../../../../services/apiGateway'
import { selectProps } from '../../../../utils/setupUtils'
import { CustomInput } from '../../../../../components/CustomInput/CustomInput'
import '../CampusModal/CampusModal.scss'
import { campusRoutes } from '../../../../../../../services/urls'


const OrientationCompletedModal = ({ cancel, eventId }: { cancel: () => void, eventId: string }) => {
    const [groupFormed, setGroupFormed] = useState<selectProps>({} as selectProps)
    const [nop, setNop] = useState('')
    const [remarks, setRemark] = useState('')

    useEffect(() => {
    }, [])
    return (
        <div className='secondary-box'>
            {/* <div className="data-box">
                <div className="content">
                    <CustomSelect
                        option={[{ id: '0', name: 'Yes' }, { id: '1', name: 'No' }]}
                        header={'Whatsapp Group Formed'}
                        placeholder={'Yes or No'}
                        customCSS={{
                            className: "react-select-container",
                            classNamePrefix: "react-select"
                        }}
                        setData={setGroupFormed}
                    />
                </div>
            </div> */}
            <div className="data-box">
                <div className="content">
                    <CustomInput value={'No of Participants'} data={nop} setData={setNop} customCSS={'setup-item'} />
                </div>
            </div>
            <div className="data-box">
                <div className="content">
                    <CustomInput value={'Remarks'} data={remarks} setData={setRemark} customCSS={'setup-item'} />
                </div>
            </div>

            <div className='last-container'>
                <div className="modal-buttons">
                    <button className='btn-update ' onClick={() => updateEvent(eventId, nop, remarks, cancel)}>Add Orientation Details</button>
                    <button className="cancel-btn " onClick={cancel}>Cancel</button>
                </div>
            </div>
        </div>

    )
}
function updateEvent(eventId: string, nop: string, remarks: string, cancel: () => void) {
    privateGateway.put(`${campusRoutes.updateEvent}${eventId}/`, {
        no_of_participants: nop,
        remarks: remarks,
        status: 'Completed',
    })
        .then((res) => {
            console.log(res)
            cancel();
        })
}
export default OrientationCompletedModal