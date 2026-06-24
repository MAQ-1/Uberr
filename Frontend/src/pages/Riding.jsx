import React, { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import car from '../assets/car.webp'
import location from '../assets/location.png'
import money from '../assets/money.png'
import Home from '../assets/home.png'
import { Link, useLocation, useNavigate } from "react-router-dom";
import downarrow from "../assets/arrow-down-double-fill.png"
import { useEffect, useContext } from 'react'
import { SocketDataContext } from '../context/SocketContext'
import LiveTracking from '../components/LiveTracking'

const Riding = () => {
  const [panelOpen, setPanelOpen] = useState(true)
  const panelRef = useRef(null)
  const { onMessage } = useContext(SocketDataContext)
  const navigate = useNavigate()

  useGSAP(function () {
    if (panelOpen) {
      gsap.to(panelRef.current, {
        transform: 'translateY(0)',
      })
    } else {
      gsap.to(panelRef.current, {
        transform: 'translateY(100%)',
      })
    }
  }, [panelOpen])

  const locationState = useLocation()
  const stateRide = locationState.state?.rideData || null

  let storedRide = null
  try {
    const rawRide = localStorage.getItem('activeRideData')
    storedRide = rawRide ? JSON.parse(rawRide) : null
  } catch (error) {
    storedRide = null
  }

  const ride = stateRide || storedRide
  const captain = ride?.captain || {}
  const captainFirstName = captain?.Fullname?.Firstname || captain?.fullname?.firstname || captain?.name || 'Captain'
  const captainLastName = captain?.Fullname?.Lastname || captain?.fullname?.lastname || ''
  const captainName = `${captainFirstName} ${captainLastName}`.trim()
  const captainPlate = captain?.vehicle?.plate || captain?.vehicle?.number || 'N/A'
  const captainVehicleName = `${captain?.vehicle?.color || ''} ${captain?.vehicle?.vehicleType || ''}`.trim() || 'Vehicle assigned'

  useEffect(() => {
    const unsubscribe = onMessage('ride-ended', (payload) => {
      console.log('[Riding] ride-ended received:', payload)
      console.log('[Riding] payload structure:', JSON.stringify(payload, null, 2))
      navigate('/home')
    })
    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [onMessage, navigate])

  return (
    <div className='h-screen overflow-hidden flex flex-col'>

        
      <div className='flex-1 relative bg-gray-200 z-0'>
        <LiveTracking />
      </div>
      
      {/* Small Summary Panel */}
      <div className='p-4 flex flex-col items-center justify-between bg-yellow-400 h-1/5 z-10 relative' onClick={() => setPanelOpen(true)}>
           <h5 className='p-1 text-center font-semibold text-lg cursor-pointer text-gray-800' style={{ transform: 'rotate(180deg)' }}>
              <img src={downarrow} alt="Up Arrow" className='h-4' />
           </h5>
           <h4 className='text-xl font-semibold'>Ride in Progress</h4>
           <button className='w-full mt-2 bg-green-600 text-white text-sm font-semibold p-2.5 rounded-lg'>
            Make a Payment
          </button>
      </div>

      <div ref={panelRef} className='fixed w-full z-10 bottom-0 bg-white px-3 py-4 shadow-lg'>
        <div>
           <img src={downarrow} alt="Down Arrow" className='absolute top-2 left-1/2 -translate-x-1/2 cursor-pointer'
           onClick={()=>{
            setPanelOpen(false)
           }}/>
          <div className="flex items-center justify-between ">
            
            <img className='h-16' src={car} alt="Confirm Vehicle" loading="lazy" />
            <div className='text-right'>
              <h2 className="text-base font-semibold -mb-1">{captainName}</h2>
              <h4 className="text-lg font-bold -mb-1">{captainPlate}</h4>
              <h4 className="text-xs text-gray-600">{captainVehicleName}</h4>
            </div>
          </div>

          <div className='flex gap-1 flex-col items-center mt-2'>
            <div className='w-full'>
              {/* Pickup Address Section */}
              <div className='flex items-center gap-3 p-2 border-b-2'>
                <img className='h-5' src={location} alt="Pickup Location" loading="lazy" />
                <div>
                  <h3 className='text-sm font-medium'>Pickup</h3>
                  <p className='text-xs -mt-1 text-gray-600'>{ride?.pickup || 'Not available'}</p>
                </div>
              </div>

              {/* Destination address */}
              <div className='flex items-center gap-3 p-2 border-b-2'>
                <img className='h-5' src={location} alt="Destination Location" loading="lazy" />
                <div>
                  <h3 className='text-sm font-medium'>Destination</h3>
                  <p className='text-xs -mt-1 text-gray-600'>{ride?.destination || 'Not available'}</p>
                </div>
              </div>

              {/* Fare and Payment Summary Section */}
              <div className='flex items-center gap-3 p-2'>
                <img className='h-5' src={money} alt="Fare Details" loading="lazy" />
                <div>
                  <h3 className='text-base font-medium'>₹{ride?.fare ?? '--'} </h3>
                  <p className='text-xs -mt-1 text-gray-600'>Cash</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button className='w-full mt-2 bg-green-600 text-white text-sm font-semibold p-2.5 rounded-lg'>
          Make a Payment
        </button>
      </div>
    </div>
  )
}

export default Riding