import * as React from 'react';
import { Text, View, StyleSheet,Component } from 'react-native';
  import * as Google from 'expo-google-app-auth'; 
 import GoogleFit, { Scopes } from 'react-native-google-fit'
 import Cookies from 'universal-cookie';
import axios from 'axios';


 async function signInWithGoogleAsync() {

   const options={
      androidClientId: '692136840520-dj9s0hv4hsc4bjd9bskdrfq0h0rvimfa.apps.googleusercontent.com',
      iosClientId: '692136840520-o65ivrf3hsu98h95ddnpgsc5f4mai4up.apps.googleusercontent.com', 
      scopes: [
      'profile', 
      'email',
      'https://www.googleapis.com/auth/fitness.activity.read',  
      'https://www.googleapis.com/auth/fitness.activity.write',
      'https://www.googleapis.com/auth/fitness.location.read',
      'https://www.googleapis.com/auth/fitness.location.write',
      'https://www.googleapis.com/auth/fitness.body.read',
      'https://www.googleapis.com/auth/fitness.body.write' 
      ],
    }
   
  try {
    const request = await Google.logInAsync(options);
    if (request.type === 'success') {
      const toky=request.accessToken;
      console.log(request);
      console.log("- - - - - - - - - - - - - -- - - - -"); 
      

      // just tring random api   
      let rel=await axios({
        url:'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
        method:'POST',
        headers:{
          Authorization: `Bearer ${toky}`
        },
        data:{
        "aggregateBy": [{
        "dataSourceId":
        "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps"
        }],
        "bucketByTime": { "durationMillis": 86400000 },
        "startTimeMillis": Date.now()-86400000,
        "endTimeMillis": Date.now()
        }
      })
      .then((resp) => {
            // now, each data bucket represents exactly one day
            // for(let idx=0; idx<7; idx++) {
            //   resp.data.bucket[idx].dataset[0].point.forEach((point) => {
            //     point.value.forEach((val) => {
            //       let extract = val['intVal'] || Math.ceil(val['fpVal']) || 0;

            //     })
            //   })
            // }
               resp.data.bucket[0].dataset[0].point.forEach((point) => {
                point.value.forEach((val) => {
                  let extract = val['intVal'] || Math.ceil(val['fpVal']) || 0;
                    console.log("step count => "+extract);
                })
              })
           })
      console.log(rel);

      return request.accessToken;
    } else {
      return { cancelled: true };
    }
  } catch (e) {
    return { error: true };
  }
}
 
class App extends React.Component{
  constructor(props){
    super(props);
  }    
 
  onPress=()=> {
    console.log("button clicked");
    signInWithGoogleAsync();
 }
  render(){
     return <Text onPress={this.onPress()}> Toggle Auth </Text>;
  }
}

export default App;
 