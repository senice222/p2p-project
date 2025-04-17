import React from 'react'
import styled from 'styled-components'

const StyledCenteredContainer = styled.div`
  position: relative;
  margin: 90px auto 0px;
  z-index: 10;
  border-radius: 1rem;
  width: 90%;
  max-width: 1200px;
`

const CenteredContainer: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <StyledCenteredContainer>
      {children}
    </StyledCenteredContainer>
  )
}

export default CenteredContainer
