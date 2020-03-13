import React, { useState } from 'react'
import Head from 'next/head'
import Dropzone from 'react-dropzone'
import ImgCard from '../components/imgCard'

const Home = () => {
  const [imgFileList, setImgFileList] = useState([])
  const _addFile = async (files) => {
    if(files.length > 0) {
      const currentList = [...imgFileList]
      for(let i = 0; i < files.length; i++) {
        currentList.unshift(files[i])
      }
      setImgFileList(currentList)
    }
  }

  return (
    <React.Fragment>
      <Head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <title>Skyview - Lazy loading responsive image generator</title>
        <meta name="description" content="Generate multiple responsive image for lazy loading and their code easily." />
        <link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css?family=Sen&display=swap" rel="stylesheet" />
        <style>
          {
            `
            body {
              font-family: 'Sen', sans-serif;
            }
            `
          }
        </style>
      </Head>
      <div className="bg-gray-100 min-h-screen py-12 p-4">
        <div className="max-w-2xl m-auto">
          <div>
            <p className="tracking-wide text-5xl font-bold" style={{
              color: `#57B560`
            }}>Skyview</p>
          </div>
          <div className="mt-1">
            <p className="text-lg text-gray-800">Generate multiple responsive image and their code for lazy loading.</p>
            <p><a className="underline" href="https://codepen.io/akbarnafisa/pen/jOPzrJv" target="_blank">Demo</a> <a className="underline" href="https://github.com/verlok/lazyload" target="_blank">How to use</a></p>
          </div>
          <div className="mt-8">
            <Dropzone onDrop={acceptedFiles => _addFile(acceptedFiles)}>
              {({getRootProps, getInputProps}) => (
                <section>
                  <div className="border border-dashed py-12" style={{
                    borderColor: `#57B560`
                  }} {...getRootProps()}>
                    <input {...getInputProps()} />
                    <div className="flex items-center justify-center h-full">
                      <div>
                        <svg className="m-auto" width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" clipRule="evenodd" d="M21.9635 20.4948C22.7942 20.4948 23.2627 19.5406 22.7548 18.8833L16.2913 10.5188C15.891 10.0007 15.109 10.0007 14.7087 10.5188L10.6963 15.7113C10.3022 16.2214 9.53545 16.2307 9.12894 15.7304L7.27611 13.45C6.87592 12.9575 6.12407 12.9575 5.72388 13.45L1.32485 18.8642C0.793871 19.5177 1.25893 20.4948 2.10097 20.4948H13C13 20.4948 13 20.4948 13 20.4948C13 20.4948 13 20.4948 13 20.4948H21.9635Z" fill="#57B560"/>
                          <circle cx="7.5" cy="5.5" r="2.5" fill="#57B560"/>
                        </svg>
                        <p className="mt-2">Drag and drop or <span className="cursor-pointer underline">browse</span></p>
                      </div>
                    </div>
                  </div>
                </section>
              )}
            </Dropzone>
            <div>
              {
                imgFileList.map((file) => {
                  return (
                    <div key={`${file.size}_${file.name}`} className="mt-8">
                      <ImgCard id={`${file.size}_${file.name}`} file={file} />
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default Home