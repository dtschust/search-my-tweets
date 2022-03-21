import React, { useState } from 'react';
import _ from 'lodash';
import tweetToHTML from 'tweet-to-html';
import './almond.min.css';

type Tweet = {
  id: number;
  id_str: string;
  full_text: string;
  created_at: string;
}

async function searchTweets(query: string, password: string) {
  try {
    const { results } = await fetch(`https://drews-little-helpers.herokuapp.com/searchTweets?query=${encodeURIComponent(query)}&pw=${password}`).then(resp=>resp.json())
    return results;
  } catch (e) {
    return []
  }
}

function App() {
  const [results, setResults] = useState<Tweet[]>([])
  const [password, setPassword] = useState<string>(localStorage.getItem('password') || '')
  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e?.target;
    const results = await searchTweets(value, password);
    setResults(results);
  }
  const throttledOnChange = _.throttle(onChange, 500);

  function onPasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e?.target;
    localStorage.setItem('password', value);
    setPassword(value);
  }

  return (
    <div className="App">
      <input type='search' placeholder='Search My Tweets' onChange={throttledOnChange}/>
      {results.map((result) => {
        const __html = tweetToHTML.parse(result).html;
        return (
        <div key={result.id_str} style={{margin: '30px 0', border: '1px solid black', padding: '10px' }} >
          <div dangerouslySetInnerHTML={{ __html }}/>
          <div>
            <a target='_blank' rel='noreferrer' href={`https://twitter.com/nuncamind/status/${result.id_str}`}>{result.created_at}</a>
          </div>
        </div>
        )
      })}
      <input type='password' value={password} onChange={onPasswordChange} />
    </div>
  );
}

export default App;
