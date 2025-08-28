# EtherCS Extension  

The EtherCS Extension is a companion tool to the EtherCS marketplace, built to **automate and streamline Steam trade offers**. Instead of relying on manual interaction, it uses background scripts to send trades directly through Steam’s API.

## Stack & Systems  
- **Manifest v3** Chrome/Firefox-compatible extension.  
- **Background script** handles trade offer requests using stored Steam session cookies.  
- **Minimal content scripts** only when user interaction is needed.  
- Built with **JavaScript**, designed for portability and simplicity.  

## Core Features  
- Receives trade instructions (asset IDs, trade URLs) from the EtherCS backend.  
- Automatically constructs and sends trade offers via Steam’s API in the background.  
- Can interact with the DOM if required (e.g., popup confirmations), though the focus is API-first.  
- Lightweight and minimal by design, no unnecessary checks or overhead.  

## Development Approach  
- Mirrors the phased mindset of EtherCS: **functionality first, then abstraction**.  
- Focused on **simplicity and reliability**, every line written to serve a direct purpose.  
- Designed to scale alongside the marketplace as trading volume grows.  

## Relation to EtherCS  
This extension is not standalone it, directly supports the **EtherCS marketplace** (Repo can be found on my profile) by executing trades on behalf of users. While EtherCS handles listings, pricing, and transactions, the extension provides the backend automation needed to complete Steam trades seamlessly.  

---