import React,{ChangeEvent} from 'react'
import { useGoogleMapsScript, Libraries } from 'use-google-maps-script';
import usePlacesAutocomplete,{ getGeocode, getLatLng } from 'use-places-autocomplete';
import * as geokit from 'geokit';
import {
	Combobox,
	ComboboxInput,
	ComboboxPopover,
	ComboboxList,
	ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";

interface ISearchBoxProps{
    onSelectAddress: (
        address:string,
        latitude:number|null,
        longitude:number|null
    )=> void;
    defaultValue:string
}



const libraries:Libraries =['places'];

export default function SearchBox ({onSelectAddress, defaultValue}:ISearchBoxProps){
    const {isLoaded, loadError}= useGoogleMapsScript({
        googleMapsApiKey:process.env.NEXT_PUBLIC_GOOGLE_API_KEY ?? "",
        libraries,
        region:'ZA'
    });

    if(!isLoaded) return null;
    if(loadError) return <div>Error Loading</div>


    return (
        <ReadySearchBox onSelectAddress={onSelectAddress} defaultValue={defaultValue}/>
    )


}

function ReadySearchBox({onSelectAddress, defaultValue}:ISearchBoxProps){

    const {
        ready,
        value,
        setValue,
        suggestions:{status,data},
        clearSuggestions
    }  = usePlacesAutocomplete({debounce:300, defaultValue })

    const handleSelect= async(address:string)=>{

        setValue(address, false);
        try {
            const results = await getGeocode({address})
            const {lat, lng}= await getLatLng(results[0]);
            onSelectAddress(address, lat, lng);

            const start = {lat:lat, lng: lng};
            const end = {lat: -33.9631609, lng: 18.4632142};

            const distance = geokit.distance(start, end)
            console.log((distance +2.05 )* 4.05)
            
        } catch (error) {
            console.log(error)
        }
    };

    const handleChange=(e:ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        if(e.target.value ===""){
            onSelectAddress("",null, null)

        };
    
       
    };

    return (
        <Combobox onSelect={(handleSelect)} >
            <ComboboxInput id='search' onChange={handleChange} disabled={!ready} placeholder='Enter Client Location' className=' bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block min-w-[50%] p-2.5 
            ' autoComplete='off'/>
        <ComboboxPopover>
            <ComboboxList className='bg-white text-gray-800' >
                {status=="OK" && data.map(({placeid, description})=> <ComboboxOption key={placeid} value={description}/>)}
            </ComboboxList>
        </ComboboxPopover>
        </Combobox>
    )
}
