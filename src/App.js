import { Card, Grid, Image, Icon, Modal, Button, Header, Pagination } from 'semantic-ui-react'
import './App.css';
import useSWR from 'swr'
import React, { useState } from 'react'
function App() {
  const fetcher = (...args) => fetch(...args).then(res => res.json())
  const [pageIndex, setPageIndex] = useState(1);
  const { data, error } = useSWR(`https://rickandmortyapi.com/api/character?page=${pageIndex}`, fetcher)
  const [open, setOpen] = React.useState(false)
  const [character, setCharacter] = useState()

  const renderModal = () => {
    return (
      <Modal
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}

      >
        <Modal.Header>{character.name}</Modal.Header>
        <Modal.Content image>
          <Image size='medium' src={character.image} wrapped />
          <Modal.Description className="modalDescription">
            <Header>Episodes:</Header>
            <div>{character.episode.map((episode) => <Episode episode={episode}></Episode>)}</div>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => setOpen(false)}>
            Close
          </Button>

        </Modal.Actions>
      </Modal>
    )

  }
  const renderCard = (character) => {
    return <Grid.Column key={character.id} width={3}><Card className="card" link onClick={() => { setOpen(true); setCharacter(character) }}>
      <Image src={character.image} wrapped ui={false} />
      <Card.Content>
        <Card.Header>{character.name}</Card.Header>
        <Card.Meta>
          <div>Status: {character.status}</div>
          <div>Species: {character.species}</div>
          <div>Gender: {character.gender}</div>
          <div>Origin: {character.origin.name}</div>
          <div>location: {character.location.name}</div>
        </Card.Meta>

      </Card.Content>
      <Card.Content extra>
        <Icon name='info' />{character.episode.length} Episodes
      </Card.Content>
    </Card>
    </Grid.Column >
  }
  if ((data && Object.keys(data).length) && !data.error) {
    return (
      <div className="App">
        <div className="navbar"> RICK AND MORTY</div>
        {character && renderModal()}
        <Grid className="cardWrapper">
          {data.results.map((character) => renderCard(character))}
        </Grid>
        <Pagination className="pagination" defaultActivePage={5} totalPages={data.info.pages} activePage={pageIndex} onPageChange={(event, data) => setPageIndex(data.activePage)} />
      </div>
    );
  }
  else return <div>Loading..</div>
}

function Episode(episode) {
  const fetcher = (...args) => fetch(...args).then(res => res.json())
  const { data, error } = useSWR(episode.episode || "", fetcher)
  if (data && Object.keys(data).length)
    return <span>{data.name},</span>
  return <div></div>
}

export default App;
