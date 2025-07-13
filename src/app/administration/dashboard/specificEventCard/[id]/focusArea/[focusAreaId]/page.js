'use client';
import React from 'react';
import { useParams } from 'next/navigation';

export default function FocusArea() {
    const { focusAreaId } = useParams();
    console.log(focusAreaId);
    return (
        <div>
            <h1>Focus Area {focusAreaId}</h1>
        </div>
    );
}
