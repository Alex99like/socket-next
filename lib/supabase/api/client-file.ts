'use client'

import { Database } from '@/types/supabase';
import { SupabaseClient, useSupabaseClient } from '@supabase/auth-helpers-react';
import { v4 as uuid } from 'uuid'
import { createSupabaseBrowerClient } from '../client';

type NameType = 'avatar_image'

export const uploadFile = async (name: NameType, file: File) => {
  const supabase: SupabaseClient<Database> = createSupabaseBrowerClient()

  const { data, error } = await supabase.storage
    .from('avatar_img')
    .upload(`avatar_img-${uuid()}`, file);
    console.log(error)

  return data
}