import React from 'react'
import styled from 'styled-components'

const StyledCenteredContainer = styled.div`
  position: fixed;
  top: 90px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  border-radius: 1rem;
  width: 90%;
  height: 40%;
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
