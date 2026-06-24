import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import uberLogo from '../assets/Uber.png'
import HomeNavImg from '../assets/home.png'
import { useState, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import FinishRide from '../components/FinishRide.jsx'
import LiveTracking from '../components/LiveTracking.jsx'

const CaptainRiding = () => {
  const location = useLocation()
  const stateRide = location.state?.ride || null

  let storedRide = null
  try {
    const rawRide = localStorage.getItem('activeCaptainRideData')
    storedRide = rawRide ? JSON.parse(rawRide) : null
  } catch (error) {
    storedRide = null
  }

  const ride = stateRide || storedRide

  if (stateRide) {
    localStorage.setItem('activeCaptainRideData', JSON.stringify(stateRide))
  }

  const user = ride?.user || {}
  const firstName = user?.fullname?.firstname || user?.Fullname?.Firstname || user?.firstname || user?.Firstname || 'Passenger'
  const lastName = user?.fullname?.lastname || user?.Fullname?.Lastname || user?.lastname || user?.Lastname || ''
  const passengerName = `${firstName} ${lastName}`.trim()
  const distanceText = ride?.distance ? `${ride.distance} KM away` : 'Trip in progress'
  const pickupText = ride?.pickup || 'Not available'
  const destinationText = ride?.destination || 'Not available'
  const fareText = ride?.fare ?? '--'

    const [finishRidePanel, setfinishRidePanel] = useState(false)
    const finishRidePanelRef = useRef(null)


      useGSAP(function () {
      if (finishRidePanel) {
         gsap.to(finishRidePanelRef.current, {
            transform: 'translateY(0)',
         })
      } else {
         gsap.to(finishRidePanelRef.current, {
            transform: 'translateY(100%)',
         })
      }


   }, [finishRidePanel])


  return (
       <div className='h-screen flex flex-col overflow-hidden relative'>
      {/* Header Section */}
      <div className='fixed p-6 top-0 flex items-center justify-between w-full z-10 pointer-events-none'>
        <img className='w-16 pointer-events-auto' src={uberLogo} alt="Uber Logo" />
        <Link to="/captain-home" className='h-10 w-10 bg-white flex items-center justify-center rounded-full z-10 pointer-events-auto shadow-md'>
          <img className='h-6' src={HomeNavImg} alt="Home" />
        </Link>
      </div>

      {/* Map/Visual Section */}
      <div className='h-4/5 bg-gray-200 z-0 relative'>
        <LiveTracking />
      </div>

      <div className='flex flex-col items-center justify-between z-10 p-5 h-1/5 space-y-2 bg-amber-600'
      onClick={()=>{
        setfinishRidePanel(true)
      }}>
          <h5 className='p-1 text-center w-[90%] absolute top-0 font-semibold text-lg'><i className="ri-arrow-up-wide-line"></i></h5>
          <h4 className='text-xl font-semibold'>{distanceText}</h4>
          {/* <p className='text-sm font-medium text-gray-800'>{passengerName}</p> */}
          <button className='bg-green-600 text-white font-semibold p-2 px-10 rounded-lg'>Start Ride</button>
      </div>

      <div ref={finishRidePanelRef} className= " z-10 h-4/5 translate-y-full bg-white fixed bottom-0 w-full px-3 pb-4 pt-5 space-y-4">
             <FinishRide
              ride={ride}
             passengerName={passengerName}
             distanceText={distanceText}
             pickupText={pickupText}
             destinationText={destinationText}
             fareText={fareText}
              setFinishRidePanel={setfinishRidePanel}
             />
           </div>

      


    </div> 
  )
}

export default CaptainRiding