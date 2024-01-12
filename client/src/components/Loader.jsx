
export default function Loader({state}){
return(
<div className='loading-icon-container' style={
    state.visible ? 
    {
    'opacity': '1',
    'visibility': 'visible'
    } : {}}>
<div className='loading-icon'>
<p className='loading-progress'>{state.message}</p>
</div>
</div>)
}