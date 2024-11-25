import { useState } from 'react'
import {  
  DateSelectArg,
  
} from '@fullcalendar/core'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { createEventId } from './event-utils'
//import { EditModal } from './edit-modal'
import { CreateModal } from './create-modal'

// interface DemoAppState {
//   weekendsVisible: boolean
//   currentEvents: EventApi[]
// }

export function FullCalendarDemo2() {
 // const [isEdit, setIsEdit] = useState(false)
  //const [editValue, setEditValue] = useState()
  const [isCreate, setIsCreate] = useState(false)
  //const [select, setSelect] = useState(false)

  function createNewData(payload: any) {
    console.log('createNewData', payload)
    //let calendarApi = selectInfo.view.calendar
    //calendarApi.unselect() // clear date selection

    // if (title) {
    //   calendarApi.addEvent({
    //     id: createEventId(),
    //     title,
    //     start: selectInfo.startStr,
    //     end: selectInfo.endStr,
    //     allDay: selectInfo.allDay
    //   })
    // }
  }
  function handleDateSelect (selectInfo: DateSelectArg)  {
    let title = prompt('Please enter a new title for your event')
    let calendarApi = selectInfo.view.calendar
    calendarApi.unselect() // clear date selection
  
    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      })
    }
  }
  

 

  return (
    <div className='demo-app'>
      <div className='demo-app-main'>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek,dayGridDay',
          }}
          initialView='dayGridMonth'
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          // initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
          select={handleDateSelect}
          // eventContent={renderEventContent} // custom render function
          //eventClick={() => setIsEdit(true)}
          // eventsSet={this.handleEvents} // called after events are initialized/added/changed/removed
          /* you can update a remote database when these fire:
            eventAdd={function(){}}
            eventChange={function(){}}
            eventRemove={function(){}}
            */
        />
      </div>

      {/* <EditModal
        isOpen={isEdit}
        onClose={() => setIsEdit(false)}
        data={editValue}
      /> */}

      <CreateModal
        isOpen={isCreate}
        onClose={() => setIsCreate(false)}
        createData={(e) => createNewData(e)}
      />
    </div>
  )
}

