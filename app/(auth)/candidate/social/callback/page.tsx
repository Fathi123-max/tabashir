
import React from 'react'
import { prisma } from '@/app/utils/db'
import { redirect } from 'next/navigation'
import { auth } from '@/app/utils/auth'
import { strict } from 'assert'
import { string } from 'zod'
const CandidateSocialCallback = async () => {
  const session = await auth()
  const userId =  session?.user.id

  const candidaet = await prisma.candidate.findUnique({
    where:{
      userId
    },
    include:{
      profile:{
        select:{
          onboardingCompleted:true
        }
      }
    }
  })

  if(!candidaet){
   
    await prisma.candidate.create({
      data:{
        userId:userId as string
      }
    })
    await prisma.user.update({
      where:{
        id:userId
      },
      data:{
        userType:"CANDIDATE"
      }
    })
   return redirect(`/candidate/${userId}/personal-info`)
  }


  if(candidaet && !candidaet.profile?.onboardingCompleted){
   return redirect(`/candidate/${userId}/personal-info`)
  }

  if(candidaet && candidaet.profile?.onboardingCompleted === true){
    return redirect("/dashboard")
  }

  return <h1>Redirecting...</h1>
}

export default CandidateSocialCallback
