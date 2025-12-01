{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs =
    { nixpkgs, ... }:
    let
      pkgs = nixpkgs.legacyPackages.x86_64-linux;

    in
    {
      devShells.x86_64-linux.default = pkgs.mkShell {
        packages =
          let
            gems = pkgs.bundlerEnv { name = "wawa"; gemdir = ./.; };
          in
          with pkgs;
          [
            gems
            gems.wrappedRuby
            bundix
          ];
      };
    };
}
