import { useEffect } from 'react'

export default function Background(){
useEffect(()=>{
VANTA.WAVES({
el: ".main",
mouseControls: false,
touchControls: true,
gyroControls: false,
minHeight: 200.00,
minWidth: 200.00,
scale: 1.00,
scaleMobile: 1.00,
color: 0xc0c0c,
shininess: 40.00,
waveHeight: 15.00,
waveSpeed: 0.60,
zoom: 0.65
})
}
,[])
}