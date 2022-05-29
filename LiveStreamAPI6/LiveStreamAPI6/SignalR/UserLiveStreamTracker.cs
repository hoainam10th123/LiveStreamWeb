namespace LiveStreamAPI6.SignalR
{
    public class UserLiveStreamTracker
    {
        private static readonly List<string> usersLiveStream = new List<string>();

        public Task<bool> UserConnectedToLiveStream(string username)
        {
            bool isOnline = false;
            lock (usersLiveStream)
            {
                usersLiveStream.Add(username);
                isOnline = true;
            }
            return Task.FromResult(isOnline);
        }

        public Task<bool> UserDisconnectedLiveStream(string username)
        {
            bool isOffline = false;
            lock (usersLiveStream)
            {
                var temp = usersLiveStream.FirstOrDefault(x => x == username);
                if (temp == null)
                    return Task.FromResult(isOffline);
                else
                {
                    usersLiveStream.Remove(temp);
                    isOffline = true;
                }
            }
            return Task.FromResult(isOffline);
        }

        public Task<string> GetUsernameLivingStream()
        {
            string username;
            lock (usersLiveStream)
            {
                username = usersLiveStream[0];
            }
            return Task.FromResult(username);
        }
    }
}
