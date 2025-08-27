"use client";

import React from 'react';

export default function Input(props) {
    return (
        <input 
            type={props.type} 
            placeholder={props.placeholder} 
            value={props.value} 
            name={props.name}
            onChange={props.onChange}
            className="p-2 m-2 border rounded-md" 
        />
    );
}