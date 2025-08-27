"use client";

import React from 'react';

export default function Button(props) {
    return (
        <button 
            onClick={props.onClick} 
            className="p-2 m-2 border rounded-md bg-blue-500 text-white hover:bg-blue-600 font-bold"
        >
            {props.text}
        </button>
    );
}
