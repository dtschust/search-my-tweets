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

async function searchTweets(query: string) {
  const { results } = await fetch(`https://drews-little-helpers.herokuapp.com/searchTweets?query=${encodeURIComponent(query)}`).then(resp=>resp.json())
  return results;
}

function App() {
  const [results, setResults] = useState<Tweet[]>([])
  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e?.target;
    const results = await searchTweets(value);
    setResults(results);
  }
  const throttledOnChange = _.throttle(onChange, 500);

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
    </div>
  );
}

export default App;
