class PeerService {
  constructor() {
    this.peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:global.stun.twilio.com:3478",
          ],
        },
      ],
    });

    this.trackCallback = null;
    this.iceCallback = null;
    this.remoteDescriptionSet = false;
    this.pendingCandidates = [];

    this.peer.ontrack = (event) => {
      if (this.trackCallback) {
        this.trackCallback(event);
      }
    };

    this.peer.onicecandidate = (event) => {
      if (event.candidate && this.iceCallback) {
        this.iceCallback(event.candidate);
      }
    };
  }

  async getOffer() {
    const offer = await this.peer.createOffer();
    await this.peer.setLocalDescription(offer);
    return offer;
  }

  async getAnswer(offer) {
    await this.peer.setRemoteDescription(new RTCSessionDescription(offer));
    this.remoteDescriptionSet = true;

    // Flush queued candidates
    this.pendingCandidates.forEach((candidate) => {
      this.peer.addIceCandidate(candidate).catch(console.error);
    });
    this.pendingCandidates = [];

    const answer = await this.peer.createAnswer();
    await this.peer.setLocalDescription(answer);
    return answer;
  }

  async setRemoteAns(ans) {
    await this.peer.setRemoteDescription(new RTCSessionDescription(ans));
    this.remoteDescriptionSet = true;

    // Flush queued ICE candidates
    this.pendingCandidates.forEach((candidate) => {
      this.peer.addIceCandidate(candidate).catch(console.error);
    });
    this.pendingCandidates = [];
  }

  onTrack(callback) {
    this.trackCallback = callback;
  }

  onIceCandidate(callback) {
    this.iceCallback = callback;
  }

  async addIceCandidate(candidate) {
    if (candidate) {
      if (this.remoteDescriptionSet) {
        try {
          await this.peer.addIceCandidate(new RTCIceCandidate(candidate));
          console.log("✅ ICE candidate added");
        } catch (err) {
          console.error("❌ Failed to add ICE candidate:", err);
        }
      } else {
        console.warn(
          "⏳ Remote description not set yet. Queuing ICE candidate."
        );
        this.pendingCandidates.push(new RTCIceCandidate(candidate));
      }
    }
  }
}

export default new PeerService();
