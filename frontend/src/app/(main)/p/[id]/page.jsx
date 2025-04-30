'use client';
import { useEffect } from 'react';
import React from 'react'

import { useRouter } from 'next/navigation';
import { get_url } from '../../../../../api/api';

export default  function RedirectPage({ params }) {
  const { id } = params;
  const router = useRouter();

  useEffect(() => {
    const fetchAndRedirect = async () => {
      try {
        // Llama al backend Django directamente
        const res = await get_url(id)
        const url = res.data.url;
        console.log(url)

        // Redirección real desde el navegador (esto preserva IP, Referer, etc.)
        window.location.href = url;
      } catch (error) {
        console.error('Error al redirigir:', error);
        router.push('/error');
      }
    };

    fetchAndRedirect();
  }, [id]);

  return null
}