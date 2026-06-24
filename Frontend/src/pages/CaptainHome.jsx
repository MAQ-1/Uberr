import React, { useState, useRef, useEffect, useContext } from 'react'
import { Link } from "react-router-dom";
import uberLogo from '../assets/Uber.png'
import Home from '../assets/home.png'
import CaptainDetails from '../components/CaptainDetails.jsx'
import RidePopUp from '../components/RidePopUp.jsx'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ConfirmRidePopup from '../components/ConfirmRidePopup.jsx'
import { SocketDataContext } from '../context/SocketContext.jsx'
import { CaptainDataContext } from '../context/CaptainContext.jsx'
import LiveTracking from '../components/LiveTracking.jsx' 


const CaptainHome = () => {
  const [ridePopupPanel, setridePopupPanel] = useState(false)
  const [ride, setRide] = useState(null) // ADDED: State to store incoming ride data
  const ridePopupPanelRef = useRef(null)
  const ConfirmRidePopupRef = useRef(null)
  const [ConfirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false)
  const joinedCaptainIdRef = useRef(null)
  const { sendMessage, onMessage, isConnected } = useContext(SocketDataContext)
  const { captain } = useContext(CaptainDataContext)
  const captainId = captain?._id || captain?.id || null


  
  useEffect(() => {
    console.log('[CaptainHome] useEffect triggered:', { isConnected, captainId, joinedId: joinedCaptainIdRef.current })
    
    if (!isConnected || !captainId) {
      joinedCaptainIdRef.current = null
      return
    }

    if (joinedCaptainIdRef.current === captainId) {
      console.log('[CaptainHome] already joined, skipping')
      return
    }

    console.log('[CaptainHome] joining as captain:', captainId)
    joinedCaptainIdRef.current = captainId

    sendMessage('join', { userType: 'captain', userId: captainId })
    console.log('[CaptainHome] socket join sent:', { captainId })

    console.log('[CaptainHome] setting up new-ride listener')
    
    const unsubscribe = onMessage('new-ride', (payload) => {
      console.log('[CaptainHome] new-ride:', payload)
      setRide(payload) // ADDED: Store the incoming ride data
      setridePopupPanel(true)
    })
    console.log('[CaptainHome] new-ride listener setup complete')

    // Function to send location
    const sendLocation = () => {
      if (navigator.geolocation) {
        console.log('[CaptainHome] requesting geolocation...')
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              ltd: position.coords.latitude,
              lng: position.coords.longitude
            }
            console.log('[CaptainHome] location received:', location)
            sendMessage('update-location-captain', { userId: captainId, location })
            console.log('[CaptainHome] location sent:', location)
          },
          (error) => {
            console.error('[CaptainHome] geolocation error:', error.code, error.message)
          },
          { timeout: 5000, enableHighAccuracy: false }
        )
      } else {
        console.error('[CaptainHome] geolocation not supported')
      }
    }

    // Send location immediately
    sendLocation()

    // Send captain location every 10 seconds
    const locationInterval = setInterval(sendLocation, 10000)

    return () => {
      console.log('[CaptainHome] cleanup called')
      clearInterval(locationInterval)
      // Don't unsubscribe here - let it persist
    }
  }, [isConnected, captainId])

   


  // ConfirmRide function
  async function confirmRide(){
    if (!ride?.rideId) {
      console.error('No ride to confirm')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:4000'
      
      const response = await fetch(`${baseURL}/rides/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rideId: ride.rideId })
      })

      if (response.ok) {
        console.log('Ride confirmed successfully')
        setConfirmRidePopupPanel(false)
      } else {
        console.error('Failed to confirm ride')
      }
    } catch (error) {
      console.error('Error confirming ride:', error)
    }
  }



  // Pop up panel animation
    useGSAP(function () {
      if (ridePopupPanel) {
         gsap.to(ridePopupPanelRef.current, {
            transform: 'translateY(0)',
         })
      } else {
         gsap.to(ridePopupPanelRef.current, {
            transform: 'translateY(100%)',
         })
      }

   }, [ridePopupPanel])
 

  //  confirm ride popup animation
       useGSAP(function () {
      if (ConfirmRidePopupPanel) {
         gsap.to(ConfirmRidePopupRef.current, {
            transform: 'translateY(0)',
         })
      } else {
         gsap.to(ConfirmRidePopupRef.current, {
            transform: 'translateY(100%)',
         })
      }

   }, [ConfirmRidePopupPanel])

  return (
    <div className='h-screen flex flex-col overflow-hidden'>
      {/* Header Section */}
      <div className='fixed p-6 top-0 flex flex-col right-38 items-center  w-full z-10 pointer-events-none'>
        <Link to="/captain-login" className='h-10 w-10  bg-white flex items-center justify-center rounded-full z-10 pointer-events-auto shadow-md'>
          <img className='h-6 ' src={Home} alt="Home" />
        </Link>
        <img className='w-16 pointer-events-auto' src={uberLogo} alt="Uber Logo" />
        
      </div>

      {/* Map/Visual Section */}
      <div className='h-3/5 bg-gray-200'>
        <LiveTracking
          className='w-full h-full object-cover'
          
        />
      </div>

      {/* Captain Info & Stats Section */}
      <div className='h-2/5 p-6 flex flex-col bg-white'>
        <CaptainDetails 
        setridePopupPanel={setridePopupPanel} />
      </div> 

    {/* Ride Popup Panel */}
       <div ref={ridePopupPanelRef} className="z-10 translate-y-full bg-white fixed bottom-0 w-full px-3 pb-4 pt-5 space-y-4">

                <RidePopUp 
                ride={ride}
                setridePopupPanel={setridePopupPanel}
                setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                confirmRide={confirmRide}
                />
                
           </div>

           {/* Confirm ride panel  */}

           <div ref={ConfirmRidePopupRef} className= " z-10 h-screen translate-y-full bg-white fixed bottom-0 w-full px-3 pb-4 pt-5 space-y-4">
             <ConfirmRidePopup
             ride={ride}
             confirmRide={confirmRide}
             setConfirmRidePopupPanel={setConfirmRidePopupPanel}
             setridePopupPanel={setridePopupPanel}
             />
           </div>
    </div> 
  )
}

export default CaptainHome
