# Chatbot Conversation Persistence

This document explains how the chatbot conversation is preserved during fullscreen mode transitions.

## Overview

The chatbot component maintains conversation continuity when switching between normal and fullscreen modes using a persistence service that stores the conversation in localStorage.

## Components

### ChatPersistenceService
- Manages storing and retrieving chat conversations
- Uses localStorage to persist data across sessions
- Handles serialization/deserialization of Date objects
- Provides observables for real-time updates

### ChatbotComponent
- Integrates with ChatPersistenceService to save/load conversations
- Updates persistence on every message send/response
- Handles route changes to maintain conversation state
- Properly cleans up subscriptions to prevent memory leaks

## How It Works

1. **Initialization**: On component initialization, the chatbot loads the conversation from the persistence service
2. **Message Sending**: Each time a user sends a message, the conversation is saved to localStorage
3. **Bot Response**: When the bot responds, the updated conversation is saved to localStorage
4. **Fullscreen Transition**: When going fullscreen, the conversation is preserved and loaded in the fullscreen view
5. **Route Changes**: The component listens to route changes and updates its state accordingly
6. **Cleanup**: When the component is destroyed, the final conversation state is saved

## Key Features

- **Automatic Persistence**: Conversations are saved automatically after each interaction
- **Date Handling**: Proper serialization of Date objects to ISO strings for localStorage
- **Route Awareness**: Component responds to route changes to maintain correct state
- **Memory Management**: Proper subscription cleanup to prevent memory leaks
- **Error Handling**: Graceful handling of localStorage errors

## Usage

The persistence is transparent to the user - conversations will automatically be preserved when:
- Switching to fullscreen mode
- Navigating away and back to the chat
- Refreshing the page
- Closing and reopening the browser (within localStorage retention)

## Error Handling

If localStorage is unavailable or fails, the service will:
- Log the error to the console
- Continue operating with in-memory storage
- Not crash the application
- Allow normal chat functionality to continue