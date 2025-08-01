const fs = require('fs');
const axios = require('axios');

const transcribeWithAssemblyAI = async (filePath) => {
  const apiKey = process.env.ASSEMBLYAI_API_KEY;

  // Step 1: Upload audio to AssemblyAI
  const audioData = fs.readFileSync(filePath);
  const uploadRes = await axios.post('https://api.assemblyai.com/v2/upload', audioData, {
    headers: {
      'authorization': apiKey,
      'content-type': 'application/octet-stream',
    },
  });

  const uploadUrl = uploadRes.data.upload_url;

  // Step 2: Start transcription
  const transcriptRes = await axios.post(
    'https://api.assemblyai.com/v2/transcript',
    { audio_url: uploadUrl },
    {
      headers: {
        'authorization': apiKey,
        'content-type': 'application/json',
      },
    }
  );

  const transcriptId = transcriptRes.data.id;

  // Step 3: Poll until transcription is complete
  let completed = false;
  let transcription = "";

  while (!completed) {
    const pollingRes = await axios.get(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
      headers: { authorization: apiKey },
    });

    if (pollingRes.data.status === 'completed') {
      transcription = pollingRes.data.text;
      completed = true;
    } else if (pollingRes.data.status === 'error') {
      throw new Error('Transcription failed: ' + pollingRes.data.error);
    }

    await new Promise(res => setTimeout(res, 3000)); 
  }

  return transcription;
};

module.exports = transcribeWithAssemblyAI;
